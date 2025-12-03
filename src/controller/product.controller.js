import {SuccessResponse} from "../core/success.response.js";
import {ProductFactory} from "../service/product.service.js";
import { ShopService } from "../service/shop.service.js";

class ProductController {
    createProduct = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: myShop._id
            })
        }).send(res);
    }

    updateProduct = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Update product success',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: myShop._id
            })
        }).send(res);
    }

    deleteProduct = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Delete product success',
            metadata: await ProductFactory.deleteProduct(req.body.product_type, req.params.product_id, myShop._id)
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Publish product success',
            metadata: await ProductFactory.publishProductByShop({
                product_shop: myShop._id,
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Unpublish product success',
            metadata: await ProductFactory.unPublishProductByShop({
                product_shop: myShop._id,
                product_id: req.params.id
            })
        }).send(res);
    }

    getAllDraftsForShop = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Get list drafts for shop success',
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: myShop._id,
                limit: req.query.limit || 50,
                skip: req.query.skip || 0
            })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        const myShop = await ShopService.getMyShop(req.user.userId);
        
        new SuccessResponse({
            message: 'Get list publish for shop success',
            metadata: await ProductFactory.findAllPublishedForShop({
                product_shop: myShop._id,
                limit: req.query.limit || 50,
                skip: req.query.skip || 0
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product success',
            metadata: await ProductFactory.searchProducts(req.params)
        }).send(res);
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProduct success',
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct success',
            metadata: await ProductFactory.findProduct({
                product_id: req.params.product_id
            })
        }).send(res);
    }
}

export default new ProductController();