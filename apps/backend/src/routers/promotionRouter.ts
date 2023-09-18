import express from "express";
import { PromotionPostData, PromotionPutData } from "libs/data-access/src/lib/types/promotion";
import PromotionService from "../services/PromotionService";

const promotionRouter = express.Router();

promotionRouter.post('/createPromotion', async (req, res) => {
    try {
        const body = req.body as PromotionPostData
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

promotionRouter.put('/updatePromotion/:id', async(req, res) => {
    try {
        const {id} = req.params
        const input = req.body as PromotionPutData
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
