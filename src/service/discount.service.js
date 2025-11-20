'use strict'

import {discount} from "../models/discount.model.js";
import {BadRequestError} from "../core/error.response";
import {convertToObjectIdMongodb} from "../utils";
import {findAllProducts} from "../models/repositories/product.repo";

export class DiscountService {
    static async createDiscount(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user, user_used
        } = payload;

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!');
        }

        const foundDiscount = await discount.findOne(
            {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        ).lean();

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists for this shop!');
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date!');
        }

        return await discount.create({
            discount_name: name,
            discount_code: code,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: user_used || [],
            discount_shop_id: convertToObjectIdMongodb(shopId),
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        });
    }

    static async updateDiscountCode() {
        //...
    }

    static async getAllDiscountCodeWithProduct({code, shopId, userId, limit, page}) {
        const foundDiscount = await discount.findOne(
            {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        ).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code not found or inactive!');
        }

        const {discount_apply_to, discount_product_ids} = foundDiscount;
        let products;
        if (discount_apply_to === 'all') {
            products = await findAllProducts(
                {
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name'],
                    filter: {
                        product_shop: convertToObjectIdMongodb(shopId),
                        isPublished: true
                    }
                }
            );
        }

        if (discount_apply_to === 'specific') {
            products = await findAllProducts(
                {
                    filter: {
                        _id: {$in: discount_product_ids.map(id => convertToObjectIdMongodb(id))},
                        isPublished: true
                    },
                    limit: +limit,
                    page: +page,
                    sort: 'ctime',
                    select: ['product_name']
                }
            )
        }

        return products;
    }
}
