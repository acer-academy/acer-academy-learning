import express from 'express';
import AdminService from '../services/AdminService';
import { AdminPostData, AdminGetData, AdminPutData } from 'libs/data-access/src/lib/types/admin';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const input = req.body as AdminPostData;
    const admin = await AdminService.register(input);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const input = req.body as AdminGetData;
    const token = await AdminService.login(input);
    console.log(input);
    res.status(200).json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const input = req.body as AdminPutData;
    const updatedAdmin = await AdminService.updateAdmin(email, input);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await AdminService.deleteAdmin(email);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
