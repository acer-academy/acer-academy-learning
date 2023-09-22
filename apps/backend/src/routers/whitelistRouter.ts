import { Router } from 'express';
import { WhitelistService } from '../services/WhitelistService';
import { Prisma, Role } from '@prisma/client';

const whitelistRouter = Router();
const whitelistService = new WhitelistService();

whitelistRouter.post('/create', async (req, res) => {
  try {
    const whitelistData: Prisma.WhitelistItemCreateInput = req.body;
    const whitelist = await whitelistService.createWhitelist(whitelistData);

    return res.status(200).json(whitelist);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

whitelistRouter.get('/', async (_, res) => {
  try {
    const whitelist = await whitelistService.getAllWhitelist();

    return res.status(200).json(whitelist);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

whitelistRouter.get('/getWhitelistById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const whitelist = await whitelistService.getWhitelistById(id);

    return res.status(200).json(whitelist);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

whitelistRouter.get('/getWhitelistByRole/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const whitelist = await whitelistService.getWhitelistByRole(role as Role);
    return res.status(200).json(whitelist);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

whitelistRouter.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const whitelist = await whitelistService.deleteWhitelist(id);

    return res.status(200).json(whitelist);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

export default whitelistRouter;
