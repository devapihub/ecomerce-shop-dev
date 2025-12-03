'use strict'

import { shop } from "../models/shop.model.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../core/error.response.js";
import mongoose from 'mongoose';

export class ShopService {
    // Tạo shop
    static async createShop(payload) {
        const { body, files, owner } = payload;
        const { name, description, address } = body;

        let avatar = '';
        let banner = '';

        if (files) {
            if (files.avatar && files.avatar[0]) {
                avatar = files.avatar[0].path || '';
            }
            if (files.banner && files.banner[0]) {
                banner = files.banner[0].path || '';
            }
        }

        if (!owner) {
            throw new BadRequestError('Thiếu owner');
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            throw new BadRequestError('owner không hợp lệ');
        }

        if (!name || name.trim().length === 0) {
            throw new BadRequestError('Tên shop không được để trống');
        }

        if (!address || !address.street || !address.wardCode ||
            !address.districtCode || !address.provinceCode ||
            !address.wardName || !address.districtName || !address.provinceName) {
            throw new BadRequestError('Địa chỉ shop không đầy đủ');
        }

        const existingShop = await shop.findOne({ owner });
        if (existingShop) {
            throw new BadRequestError('Bạn đã có shop rồi. Mỗi tài khoản chỉ được tạo 1 shop');
        }

        const newShop = await shop.create({
            name: name.trim(),
            owner,
            description: description?.trim() || '',
            avatar: avatar || '',
            banner: banner || '',
            address: {
                street: address.street.trim(),
                wardCode: address.wardCode,
                wardName: address.wardName,
                districtCode: address.districtCode,
                districtName: address.districtName,
                provinceCode: address.provinceCode,
                provinceName: address.provinceName
            }
        });

        return newShop;
    }

    // Cập nhật shop
    static async updateShop(shopId, payload, userId) {
        if (!shopId) {
            throw new BadRequestError('Thiếu shopId');
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            throw new BadRequestError('shopId không hợp lệ');
        }

        const existingShop = await shop.findById(shopId);
        if (!existingShop) {
            throw new NotFoundError('Shop không tồn tại');
        }

        if (userId && existingShop.owner.toString() !== userId.toString()) {
            throw new ForbiddenError('Bạn không có quyền cập nhật shop này');
        }

        const { body, files } = payload;
        const { name, description, address } = body;
        const updateData = {};

        if (files) {
            if (files.avatar && files.avatar[0]) {
                const avatarUrl = files.avatar[0].path || '';
                if (avatarUrl) {
                    updateData.avatar = avatarUrl;
                }
            }
            if (files.banner && files.banner[0]) {
                const bannerUrl = files.banner[0].path || '';
                if (bannerUrl) {
                    updateData.banner = bannerUrl;
                }
            }
        }

        if (name !== undefined) {
            if (!name || name.trim().length === 0) {
                throw new BadRequestError('Tên shop không được để trống');
            }
            updateData.name = name.trim();
        }

        if (description !== undefined) {
            updateData.description = description.trim();
        }

        if (address !== undefined && address) {
            const requiredFields = [
                "street", "wardCode", "wardName",
                "districtCode", "districtName",
                "provinceCode", "provinceName"
            ];

            const missing = requiredFields.filter(field => !address[field]);

            if (missing.length > 0) {
                throw new BadRequestError(`Địa chỉ shop không đầy đủ, thiếu: ${missing.join(", ")}`);
            }

            updateData.address = {
                street: address.street.trim(),
                wardCode: address.wardCode,
                wardName: address.wardName,
                districtCode: address.districtCode,
                districtName: address.districtName,
                provinceCode: address.provinceCode,
                provinceName: address.provinceName
            };
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestError('Không có dữ liệu để cập nhật');
        }

        const updatedShop = await shop.findByIdAndUpdate(
            shopId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedShop) {
            throw new NotFoundError('Không thể cập nhật shop');
        }

        return updatedShop;
    }

    // Lấy chi tiết shop theo ID
    static async getShopById(shopId) {
        if (!shopId) {
            throw new BadRequestError("Thiếu shopId");
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            throw new BadRequestError("shopId không hợp lệ");
        }

        const foundShop = await shop.findById(shopId)
            .select('-owner')
            .lean();

        if (!foundShop) {
            throw new NotFoundError("Shop không tồn tại");
        }

        return foundShop;
    }

    // Lấy chi tiết shop theo slug (SEO)
    static async getShopBySlug(slug) {
        if (!slug || slug.trim().length === 0) {
            throw new BadRequestError("Thiếu slug");
        }

        const foundShop = await shop.findOne({
            slug: slug.trim().toLowerCase()
        })
            .select('-owner')
            .lean();

        if (!foundShop) {
            throw new NotFoundError("Shop không tồn tại");
        }

        return foundShop;
    }

    // Lấy danh sách tất cả shop (có phân trang)
    static async getAllShops({ page = 1, limit = 20, sort = '-createdAt' }) {
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        const allowedSortFields = ['createdAt', '-createdAt', 'name', '-name', 'productCount', '-productCount'];
        const sortField = allowedSortFields.includes(sort) ? sort : '-createdAt';

        const skip = (page - 1) * limit;

        const [shops, total] = await Promise.all([
            shop.find()
                .select('-owner')
                .sort(sortField)
                .skip(skip)
                .limit(limit)
                .lean(),
            shop.countDocuments()
        ]);

        return {
            shops,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    // Lấy shop của user hiện tại
    static async getMyShop(userId) {
        if (!userId) {
            throw new BadRequestError("Thiếu userId");
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new BadRequestError("userId không hợp lệ");
        }

        const myShop = await shop.findOne({ owner: userId })
            .lean();

        if (!myShop) {
            throw new NotFoundError("Bạn chưa có shop");
        }

        return myShop;
    }

    // Tìm kiếm shop theo tên
    static async searchShopsByName(keyword, { limit = 50 } = {}) {
        if (!keyword || keyword.trim().length === 0) {
            throw new BadRequestError("Từ khóa tìm kiếm không được để trống");
        }

        const regex = new RegExp(keyword.trim(), 'i');
        const limitNum = parseInt(limit);
        const finalLimit = limitNum > 0 && limitNum <= 100 ? limitNum : 50;

        const shops = await shop.find({ name: { $regex: regex } })
            .select('-owner')
            .limit(finalLimit)
            .lean();

        return shops;
    }

    // Xóa shop
    static async deleteShop(shopId, userId) {
        if (!shopId) {
            throw new BadRequestError("Thiếu shopId");
        }

        if (!mongoose.Types.ObjectId.isValid(shopId)) {
            throw new BadRequestError("shopId không hợp lệ");
        }

        const foundShop = await shop.findById(shopId);

        if (!foundShop) {
            throw new NotFoundError("Shop không tồn tại");
        }

        if (foundShop.owner.toString() !== userId.toString()) {
            throw new ForbiddenError("Bạn không có quyền xóa shop này");
        }

        if (foundShop.productCount > 0) {
            throw new BadRequestError("Không thể xóa shop đang có sản phẩm. Vui lòng xóa hết sản phẩm trước.");
        }

        await shop.findByIdAndDelete(shopId);

        return {
            message: "Xóa shop thành công"
        };
    }
}