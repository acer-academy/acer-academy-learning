// admin.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminDao from '../dao/admin.dao';
import {
  RegisterAdminData,
  LoginAdminData,
  UpdateAdminData,
} from '../types/admin.type';

class AdminService {
  async register(data: RegisterAdminData) {
    data.password = await bcrypt.hash(data.password, 10);
    return AdminDao.createAdmin(data);
  }

  async login(data: LoginAdminData) {
    const admin = await AdminDao.findAdminByEmail(data.email);
    if (!admin || !(await bcrypt.compare(data.password, admin.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign(
      { id: admin.id, type: admin.type },
      'your_secret_key',
      { expiresIn: '1h' },
    );
    return { token };
  }

  async updateAdmin(email: string, data: UpdateAdminData) {
    const admin = await AdminDao.findAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    data.password = await bcrypt.hash(data.password, 10);
    return AdminDao.updateAdmin(email, data);
  }

  async deleteAdmin(email: string) {
    const admin = await AdminDao.findAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    return AdminDao.deleteAdmin(email);
  }
}

export default new AdminService();
