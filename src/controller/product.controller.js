'use strict'

const {SuccessResponse} = require("../core/success.response");
const {ProductFactory} = require("../service/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse( {
            message: 'Create new product success',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success',
            metadata: await ProductFactory.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success',
            metadata: await ProductFactory.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list drafts for shop success',
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userId,
                limit: req.query.limit || 50,
                skip: req.query.skip || 0
            })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish for shop success',
            metadata: await ProductFactory.findAllPublishedForShop({
                product_shop: req.user.userId,
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

module.exports = new ProductController();