import express from 'express';
import AdminService from '../services/AdminService';
import {
  AdminGetData,
  AdminPutData,
} from 'libs/data-access/src/lib/types/admin';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import { Prisma } from '@prisma/client';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const input: Prisma.AdminUncheckedCreateInput = req.body;
    const admin = await AdminService.register(input);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getAllAdmins', async (_, res) => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /admins/login
 * Logs in a admin using their email and password, returns a cookie that lasts 4 hours, containing the JWT Token
 */
router.post('/login', async (req, res) => {
  try {
    const input = req.body as AdminGetData;
    const { token, user } = await AdminService.login(input);

    res.cookie('jwtToken_Admin', token, {
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

/**
 * POST /admins/logout
 * removes the cookie for the user who sent in the request
 */
router.post('/logout', (req, res) => {
  res
    .clearCookie('jwtToken_Admin', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
    })
    .status(200)
    .send({ message: 'Logout successful' });
});

/**
 * GET /admins/check-auth
 * Checks the token in the cookie and return the user information
 */
router.get('/check-auth', (req, res) => {
  const token = req.cookies.jwtToken_Admin;

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id } = decoded;

        try {
          // Query the database to retrieve the admin by id
          const admin = await AdminService.getAdminById(id);

          if (!admin) {
            res.status(404).send({ message: 'User not found' });
          } else {
            // Destructure admin object to omit password and possibly other sensitive fields
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...user } = admin;
            res.status(200).send(user); //returns user information without password
          }
        } catch (error) {
          // Handle database errors or any other errors that might occur
          res.status(500).send({ message: 'Internal Server Error' });
        }
      }
    });
  } else {
    res.status(401).send({ message: 'No token provided' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input = req.body as AdminPutData;
    const updatedAdmin = await AdminService.updateAdmin(id, input);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await AdminService.deleteAdmin(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await AdminService.requestPasswordReset(email);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await AdminService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
