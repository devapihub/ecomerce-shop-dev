'use strict'

import { SuccessResponse } from '../core/success.response.js';
import {DiscountService} from "../service/discount.service.js";

export class DiscountController {

    static async createDiscountCode(req, res, next) {
        new SuccessResponse({
            message: 'Create new discount code success',
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static async getAllDiscountCodes(req, res, next) {
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
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

}