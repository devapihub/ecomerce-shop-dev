'use strict'

import {discount} from "../models/discount.model.js";
import {BadRequestError} from "../core/error.response.js";
import {convertToObjectIdMongodb} from "../utils/index.js";
import {findAllProducts} from "../models/repositories/product.repo.js";
import {checkDiscountExists, findAllDiscountCodesUnselected} from "../models/repositories/discount.repo.js";

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

    static async getAllDiscountCodeWithProduct({code, shopId, limit, page}) {
        const foundDiscount = await discount.findOne(
            {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        ).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code not found or inactive!');
        }

        const {discount_applies_to, discount_product_ids} = foundDiscount;
        let products;
        if (discount_applies_to === 'all') {
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

        if (discount_applies_to === 'specific') {
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

    static async getAllDiscountCodesByShop({limit, page, shopId}) {
        return await findAllDiscountCodesUnselected(
            {
                filter: {
                    discount_shop_id: convertToObjectIdMongodb(shopId),
                    discount_is_active: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                unselect: ['__v', 'discount_shop_id']
            }
        );
    }

    static async getDiscountAmount(
        {
            codeId, userId, shopId, products
        }
    ) {
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: codeId,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        });

        if (!foundDiscount) {
            throw new BadRequestError('Discount code not found!');
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount;

        if (!discount_is_active) {
            throw new BadRequestError('Discount code is inactive!');
        }

        if (!discount_max_uses) {
            throw new BadRequestError('Discount are out!');
        }

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code has expired!');
        }

        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.price * product.quantity);
            }, 0);

            if (totalOrder < discount_min_order_value) {
                throw new BadRequestError(`Order must be at least ${discount_min_order_value} to apply this discount!`);
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUsedCount = discount_users_used.find(user => user.userId = userId);
            if (userUsedCount) {
               /* if (userUsedCount.length >= discount_max_uses_per_user) {
                    throw new BadRequestError('You have used this discount code the maximum number of times!');
                }*/
            }
        }

        const amount = discount_type === 'fixed_amount' ?
            discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({shopId, codeId}) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shop_id: convertToObjectIdMongodb(shopId)
        }).lean();

        if (!deleted) {
            throw new BadRequestError('Discount code not found or already deleted!');
        }

        return deleted;
    }

    static async cancelDiscount({shopId, codeId, userId}) {
        const foundDiscount = checkDiscountExists({
            filter: {
                discount_code: codeId,
                discount_shop_id: convertToObjectIdMongodb(shopId)
            }
        });

        if (!foundDiscount) {
            throw new BadRequestError('Discount code not found!');
        }

        return await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {discount_users_used: {userId: userId}},
            $inc: {
                discount_uses_count: -1,
                discount_max_uses: 1
            }
        }).exec();
    }
}
