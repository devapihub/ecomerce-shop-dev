'use strict'

import {cart} from "../models/cart.model.js";
import {getProductById} from "../models/repositories/product.repo.js";
import {NotFoundError} from "../core/error.response.js";

export class CartService {

    static async getUserCart({userId, product}) {
        const query = {cart_user_id: userId, cart_state: 'active'};
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, option = {new: true, upsert: true};
        return await cart.findOneAndUpdate(query, updateOrInsert, option).exec();
    }

    static async updateUserCartQuantity({userId, product}) {
        const {product_id, quantity} = product;
        const query = {
            cart_user_id: userId,
            cart_state: 'active',
            'cart_products.product_id': product_id
        };
        const update = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, option = {upsert: true, new: true};
        return await cart.findOneAndUpdate(query, update, option).exec();
    }

    static async addToCard({userId, product = {}}) {
        const userCard = await cart.findOne({cart_user_id: userId, cart_state: 'active'});
        if (!userCard) {
            return await CartService.getUserCart({userId, product});
        }

        if (userCard.cart_products.length === 0) {
            userCard.cart_products = [product];
            userCard.cart_count_product = userCard.cart_products.length;
            return await userCard.save();
        }

        return await CartService.updateUserCartQuantity({userId, product});
    }

    static async addToCardV2({userId, shop_order_ids = {}}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductById(productId);
        if (!foundProduct) {
            throw new NotFoundError('Product not found');
        }
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product does not belong to the shop');
        }

        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity(
            {
                userId,
                product: {productId, quantity: quantity - old_quantity}
            }
        );
    }

    static async deleteUserCart({userId, productId}) {
        const query = {cart_user_id: userId, cart_state: 'active'};
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        return await cart.updateOne(query, updateSet).exec();
    }

    static async getListUserCart({userId}) {
        return await cart.findOne(
            {cart_user_id: userId}
        ).lean();
    }
}