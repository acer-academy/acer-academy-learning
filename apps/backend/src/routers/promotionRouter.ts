import express from 'express';
import { PromotionService } from '../services/PromotionService';
import { Prisma } from '@prisma/client';
import {
  validateDateFormat,
  validatePromotionPromoCodeUnique,
  validatePromotionPercentageDiscount,
  validatePromotionDescription,
} from '../middleware/validationMiddleware';

const promotionRouter = express.Router();
const promotionService = new PromotionService();

promotionRouter.post(
  '/createPromotion',
  validateDateFormat,
  validatePromotionPromoCodeUnique,
  validatePromotionPercentageDiscount,
  validatePromotionDescription,
  async (req, res) => {
    try {
      const body: Prisma.PromotionCreateInput = req.body;
      const promotion = await promotionService.createPromotion(body);
      return res.status(200).json(promotion);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  },
);

promotionRouter.get('/getAllPromotions', async (_, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    return res.status(200).json(promotions);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/validPromotions', async (_, res) => {
  try {
    const promotions = await promotionService.getAllValidPromotions();
    return res.status(200).json(promotions);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/getPromotionById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await promotionService.getPromotionById(id);
    return res.status(200).json(promotion);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/getPromotionByPromoCode/:promoCode', async (req, res) => {
  try {
    const { promoCode } = req.params;
    const promotion = await promotionService.getPromotionByPromoCode(promoCode);
    return res.status(200).json(promotion);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.put(
  '/updatePromotion/:id',
  validatePromotionPercentageDiscount,
  validatePromotionPromoCodeUnique,
  validateDateFormat,
  validatePromotionDescription,
  async (req, res) => {
    try {
      const { id } = req.params;
      const input: Prisma.PromotionUpdateInput = req.body;
      const updatedPromotion = await promotionService.updatePromotion(
        id,
        input,
      );
      return res.status(200).json(updatedPromotion);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  },
);

promotionRouter.delete('/deletePromotion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await promotionService.deletePromotion(id);
    return res.status(200).json(promo);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

export default promotionRouter;
