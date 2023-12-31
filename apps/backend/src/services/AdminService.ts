// admin.service.ts
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import AdminDao from '../dao/AdminDao';
import { AdminGetData } from 'libs/data-access/src/lib/types/admin';

import { Admin, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/config';
import EmailUtility from './EmailUtility';
import { WhitelistService } from './WhitelistService';

class AdminService {
  constructor(
    private whitelistService: WhitelistService = new WhitelistService(),
  ) {}

  public async register(
    data: Prisma.AdminUncheckedCreateInput,
  ): Promise<Admin> {
    // skip whitelist check for super_admin

    const checkForUser = await AdminDao.getAdminByEmail(data.email);

    if (checkForUser) {
      throw new Error('Email already exists.');
    }

    const adminType = data.type;
    if (!adminType || adminType === 'STANDARD_ADMIN') {
      const isWhitelisted = await this.whitelistService.isEmailWhitelisted(
        data.email,
        'ADMIN',
      );

      if (!isWhitelisted) {
        throw new Error('Unable to create admin as email is not whitelisted!');
      }
    } else {
      // create whitelist item for super_admin
      await this.whitelistService.createWhitelist({
        email: data.email,
        role: 'SUPER_ADMIN',
      });
    }

    const whitelistItem = await this.whitelistService.getWhitelistByEmail(
      data.email,
    );

    data.password = await bcrypt.hash(data.password, 10);
    return AdminDao.createAdmin({
      ...data,
      type:
        !adminType || adminType === 'STANDARD_ADMIN'
          ? 'STANDARD_ADMIN'
          : 'SUPER_ADMIN',
      whitelistItemId: whitelistItem.id,
    });
  }

  public async getAllAdmins(): Promise<Admin[]> {
    return AdminDao.getAllAdmins();
  }

  async login(data: AdminGetData) {
    const admin = await AdminDao.getAdminByEmail(data.email);

    if (!admin || !(await bcrypt.compare(data.password, admin.password))) {
      throw new Error('Invalid credentials.');
    }

    // Generate a JWT token with necessary admin details
    const token = jwt.sign(
      {
        id: admin.id,
        // firstName: admin.firstName,
        // lastName: admin.lastName,
        // email: admin.email,
        // type: admin.type,
      },
      JWT_SECRET_KEY,
      { expiresIn: '4h' },
    );

    // Destructure admin object to omit password and possibly other sensitive fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = admin;

    return { token, user };
  }

  async updateAdmin(id: string, data: Prisma.AdminUpdateInput) {
    const admin = await AdminDao.getAdminById(id);
    if (!admin) {
      throw new Error(`Admin not found for id: ${id}`);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    return AdminDao.updateAdmin(id, data);
  }

  async deleteAdmin(id: string) {
    const admin = await AdminDao.getAdminById(id);
    if (!admin) {
      throw new Error(`Admin not found for id: ${id}`);
    }
    return AdminDao.deleteAdmin(id);
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
    await AdminDao.updateAdmin(admin.id, { password: hashedPassword });
  }

  //getAdminById
  async getAdminById(id: string) {
    return AdminDao.getAdminById(id);
  }
}

export default new AdminService();
