// admin.service.ts
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import AdminDao from '../dao/AdminDao';
import {
  AdminPostData,
  AdminGetData,
} from 'libs/data-access/src/lib/types/admin';

import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import EmailUtility from './EmailUtility';

class AdminService {
  async register(data: AdminPostData) {
    data.password = await bcrypt.hash(data.password, 10);
    return AdminDao.createAdmin(data);
  }

  async login(data: AdminGetData) {
    const admin = await AdminDao.getAdminByEmail(data.email);
    if (!admin || !(await bcrypt.compare(data.password, admin.password))) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token with necessary admin details
    const token = jwt.sign(
      {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        type: admin.type,
      },
      JWT_SECRET_KEY,
      { expiresIn: '4h' },
    );

    // Destructure admin object to omit password and possibly other sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = admin;

    return { token, user };
  }

  async updateAdmin(email: string, data: Prisma.AdminUpdateInput) {
    const admin = await AdminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return AdminDao.updateAdmin(email, data);
  }

  async deleteAdmin(email: string) {
    const admin = await AdminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    return AdminDao.deleteAdmin(email);
  }

  async requestPasswordReset(email: string) {
    const admin = await AdminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }

    // Create a short-lived JWT for password reset
    const resetToken = jwt.sign(
      { id: admin.id, action: 'password_reset' },
      JWT_SECRET_KEY,
      { expiresIn: '15m' }, // Token expires in 15 minutes
    );

    // Send email with the reset link containing the token
    const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;
    EmailUtility.sendPasswordResetEmail(email, resetLink); // Your email sending method
  }

  async resetPassword(token: string, newPassword: string) {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }

    if (decodedToken.action !== 'password_reset') {
      throw new Error('Invalid reset token');
    }

    const admin = await AdminDao.getAdminById(decodedToken.id);

    if (!admin) {
      throw new Error(`Admin not found`);
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AdminDao.updateAdmin(admin.email, { password: hashedPassword });
  }
}

export default new AdminService();
