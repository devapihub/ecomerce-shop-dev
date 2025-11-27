'use strict'

import { SuccessResponse } from '../core/success.response.js';
import {CartService} from "../service/cart.service.js";

export class CartController {
    static async addToCard(req, res, next) {
        new SuccessResponse({
            message: 'Create new cart success',
            metadata: await CartService.addToCard(req.body)
        }).send(res);
    }

    static async update(req, res, next) {
        new SuccessResponse({
            message: 'Update cart success',
            metadata: await CartService.addToCardV2(req.body)
        }).send(res);
    }

    static async delete(req, res, next) {
        new SuccessResponse({
            message: 'Delete cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res);
    }

    static async listToCard(req, res, next) {
        new SuccessResponse({
            message: 'Get list cart success',
            metadata: await CartService.getListUserCart(req.body)
        }).send(res);
    }

}