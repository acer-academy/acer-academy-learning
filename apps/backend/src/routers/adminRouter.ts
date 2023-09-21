import express from 'express';
import AdminService from '../services/AdminService';
import {
  AdminPostData,
  AdminGetData,
  AdminPutData,
} from 'libs/data-access/src/lib/types/admin';
import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config/config';

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

// router.post('/login', async (req, res) => {
//   try {
//     const input = req.body as AdminGetData;
//     const token = await AdminService.login(input);
//     console.log(input);
//     res.status(200).json(token);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const input = req.body as AdminGetData;
    const { token, user } = await AdminService.login(input);

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 * 1000, // 4 hours (needs to be same expiry as the JWT token)
    });

    res.status(200).json(user); // send user data in the response body
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  // console.log('Logout endpoint hit');
  // console.log(req);
  res
    .clearCookie('jwtToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
    })
    .status(200)
    .send({ message: 'Logout successful' });
});

//takes in the cookie and check the jwt token
router.get('/check-auth', (req, res) => {
  const token = req.cookies.jwtToken;

  // console.log('in check auth');
  // console.log(JWT_SECRET_KEY);
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' });
      } else {
        const { iat, exp, ...user } = decoded;

        res.status(200).send(user);
        // res.status(200).send(decoded);
      }
    });
  } else {
    res.status(401).send({ message: 'No token provided' });
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
