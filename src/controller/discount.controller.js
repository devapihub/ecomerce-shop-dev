'use strict'

import { SuccessResponse } from '../core/success.response.js';
import {DiscountService} from "../service/discount.service.js";
import {ShopService} from "../service/shop.service.js";

export class DiscountController {

    static async createDiscountCode(req, res, next) {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Create new discount code success',
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId: myShop._id.toString()
            })
        }).send(res);
    }

    static async getAllDiscountCodes(req, res, next) {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: myShop._id.toString()
            })
        }).send(res);
    }

    static async getDiscountAmount(req, res, next) {
        new SuccessResponse({
            message: 'Get discount code with products success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res);
    }

    static async getAllDiscountCodeWithProduct(req, res, next) {
        new SuccessResponse({
            message: 'Get discount code with products success',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res);
    }
    static async deleteDiscount(req, res, next) {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Delete discount code success',
            metadata: await DiscountService.deleteDiscount({
                code: req.params.code,
                shopId: myShop._id.toString()
            })
        }).send(res);
    }
    static async cancelDiscount(req, res, next) {
        new SuccessResponse({
            message: 'Cancel discount code success',
            metadata: await DiscountService.cancelDiscount({
                code: req.params.code,
                userId: req.user.userId
            })
        }).send(res);
    }

}