import express from 'express';
import PromotionService from '../services/PromotionService';
import { Prisma } from '@prisma/client';
import {
  validateDateFormat,
  validatePromotionPromoCodeUnique,
  validatePromotionPercentageDiscount,
  validatePromotionDescription,
} from '../middleware/validationMiddleware';

const promotionRouter = express.Router();

promotionRouter.post(
  '/createPromotion',
  validateDateFormat,
  validatePromotionPromoCodeUnique,
  validatePromotionPercentageDiscount,
  validatePromotionDescription,
  async (req, res) => {
    try {
      const body: Prisma.PromotionCreateInput = req.body;
      const promotion = await PromotionService.createPromotion(body);
      return res.status(200).json(promotion);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  },
);

promotionRouter.get('/getAllPromotions', async (_, res) => {
  try {
    const promotions = await PromotionService.getAllPromotions();
    return res.status(200).json({ promotions: promotions });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/validPromotions', async (_, res) => {
  try {
    const promotions = await PromotionService.getAllValidPromotions();
    return res.status(200).json({ promotions: promotions });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/getPromotionById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await PromotionService.getPromotionById(id);
    return res.status(200).json(promotion);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

promotionRouter.get('/getPromotionByPromoCode/:promoCode', async (req, res) => {
  try {
    const { promoCode } = req.params;
    const promotion = await PromotionService.getPromotionByPromoCode(promoCode);
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
      const updatedPromotion = await PromotionService.updatePromotion(
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
    await PromotionService.deletePromotion(id);
    return res.status(200).json({ message: 'Promotion Deleted Successfully' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

export default promotionRouter;
=======
import express from "express";
import PromotionService from "../services/PromotionService";
import { Prisma } from "@prisma/client";
import { validateDateFormat, validatePromotionPromoCodeUnique, validatePromotionPercentageDiscount } from "../middleware/validationMiddleware";

const promotionRouter = express.Router();

promotionRouter.post('/createPromotion',
validateDateFormat,
validatePromotionPromoCodeUnique, 
validatePromotionPercentageDiscount,
 async (req, res) => {
    try {
        const body = req.body as Prisma.PromotionCreateInput
        const promotion = await PromotionService.createPromotion(body)
        return res.status(200).json(promotion)
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

promotionRouter.get('/getAllPromotions', async (_, res) => {
    try {
        const promotions = await PromotionService.getAllPromotions()
        return res.status(200).json({promotions: promotions})
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

promotionRouter.get('/getPromotionById/:id', async(req, res) => {
    try {
        const {id} = req.params
        const promotion = await PromotionService.getPromotionById(id)
        return res.status(200).json(promotion)
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

promotionRouter.get('/getPromotionByPromoCode/:promoCode', async(req, res) => {
    try {
        const {promoCode} = req.params
        const promotion = await PromotionService.getPromotionByPromoCode(promoCode)
        return res.status(200).json(promotion)
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

promotionRouter.put('/updatePromotion/:id', 
validatePromotionPercentageDiscount, 
validatePromotionPromoCodeUnique,
validateDateFormat,
async(req, res) => {
    try {
        const {id} = req.params
        const input = req.body as Prisma.PromotionUpdateInput
        const updatedPromotion = await PromotionService.updatePromotion(id, input)
        return res.status(200).json(updatedPromotion)
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

promotionRouter.delete('/deletePromotion/:id', async(req, res) => {
    try {
        const {id} = req.params
        await PromotionService.deletePromotion(id)
        return res.status(200).json({message: 'Promotion Deleted Successfully'})
    } catch(err) {
        console.log(err);
        return res.status(400).json({error: err})
    }
})

export default promotionRouter