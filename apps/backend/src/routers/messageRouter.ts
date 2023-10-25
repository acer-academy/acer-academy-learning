import { Router } from 'express';
import { MessageService } from '../services/MessageService';

const messageRouter = Router();
const messageService = new MessageService();

/**
 * POST /message/
 * Sends a message.
 */
messageRouter.post('/create', async (req, res) => {
  try {
    await messageService.sendWhatsappMessage();
    return res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

export default messageRouter;
