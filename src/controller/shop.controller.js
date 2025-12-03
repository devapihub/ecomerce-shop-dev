import { CREATED, SuccessResponse } from "../core/success.response.js";
import { ShopService } from "../service/shop.service.js";

class ShopController {
    createShop = async (req, res, next) => {
        new CREATED({
            message: 'Create new shop success',
            metadata: await ShopService.createShop({
                body: req.body,
                files: req.files,
                owner: req.user.userId
            })
        }).send(res);
    }

    updateShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update shop success',
            metadata: await ShopService.updateShop(
                req.params.shop_id,
                {
                    body: req.body,
                    files: req.files
                },
                req.user.userId
            )
        }).send(res);
    }

    getShopById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get shop info success',
            metadata: await ShopService.getShopById(req.params.shop_id)
        }).send(res);
    }
    getShopBySlug = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get shop info success',
            metadata: await ShopService.getShopBySlug(req.params.slug)
        }).send(res);
    }

    getAllShops = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list of shops success',
            metadata: await ShopService.getAllShops({
                page: req.query.page || 1,
                limit: req.query.limit || 20,
                sort: req.query.sort || '-createdAt'
            })
        }).send(res);
    }

    getMyShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get my shop success',
            metadata: await ShopService.getMyShop(req.user.userId)
        }).send(res);
    }

    searchShopsByName = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search shops success',
            metadata: await ShopService.searchShopsByName(req.query.keyword)
        }).send(res);
    }

    deleteShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete shop success',
            metadata: await ShopService.deleteShop(
                req.params.shop_id,
                req.user.userId
            )
        }).send(res);
    }
}

export default new ShopController();