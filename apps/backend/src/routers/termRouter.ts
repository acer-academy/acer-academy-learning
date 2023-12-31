import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { TermService } from '../services/TermService';
import {
  validateDateFormat,
  validateDeleteTermNoTransactions,
} from '../middleware/validationMiddleware';

const termRouter = Router();
const termService = new TermService();

termRouter.post('/', validateDateFormat, async (req, res) => {
  try {
    const termData: Prisma.TermCreateInput = req.body;
    const newTerm = await termService.createTerm(termData);
    return res.status(200).json(newTerm);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

termRouter.get('/', async (req, res) => {
  try {
    const allTerms = await termService.getAllTerms();
    return res.status(200).json(allTerms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

termRouter.get('/current', async (req, res) => {
  try {
    const currentTerms = await termService.getCurrentTerms();
    return res.status(200).json(currentTerms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

termRouter.get('/:termId', async (req, res) => {
  try {
    const { termId } = req.params;
    const term = await termService.getTermById(termId);
    if (!term) {
      return res.status(404).json({ error: 'Term not found' });
    }
    return res.status(200).json(term);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

termRouter.put('/:termId', validateDateFormat, async (req, res) => {
  try {
    const { termId } = req.params;
    const input: Prisma.TermUpdateInput = req.body;
    const updatedTerm = await termService.updateTerm(termId, input);
    if (!updatedTerm) {
      return res.status(404).json({ error: 'Term not found' });
    }
    return res.status(200).json(updatedTerm);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

termRouter.delete(
  '/:termId',
  validateDeleteTermNoTransactions,
  async (req, res) => {
    try {
      const { termId } = req.params;
      const updatedTerm = await termService.deleteTerm(termId);
      if (!updatedTerm) {
        return res.status(404).json({ error: 'Term not found' });
      }
      return res.status(200).json(updatedTerm);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

export default termRouter;
