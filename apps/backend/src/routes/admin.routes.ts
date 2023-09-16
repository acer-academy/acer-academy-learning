import express from 'express';
import AdminService from '../services/admin.service';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const admin = await AdminService.register(req.body);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const token = await AdminService.login(req.body);
    console.log(req.body);
    res.status(200).json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updatedAdmin = await AdminService.updateAdmin(email, req.body);
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
