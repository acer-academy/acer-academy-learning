// admin.service.ts
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import AdminDao from '../dao/AdminDao';
import {
  AdminPostData,
  AdminPutData,
  AdminGetData,
} from 'libs/data-access/src/lib/types/admin';

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

    //jwt token version
    // const token = jwt.sign(
    //   { id: admin.id, type: admin.type, email: admin.email, name: admin.name },
    //   'your_secret_key',
    //   { expiresIn: '1h' },
    // );
    // return { token };

    // Destructure admin object to omit id, password, and type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, ...rest } = admin;

    return rest;
  }

  async updateAdmin(email: string, data: AdminPutData) {
    const admin = await AdminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    data.password = await bcrypt.hash(data.password, 10);
    return AdminDao.updateAdmin(email, data);
  }

  async deleteAdmin(email: string) {
    const admin = await AdminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error(`Admin not found for email: ${email}`);
    }
    return AdminDao.deleteAdmin(email);
  }
}

export default new AdminService();
