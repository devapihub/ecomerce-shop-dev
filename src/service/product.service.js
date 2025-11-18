'use strict'

import {BadRequestError} from "../core/error.response.js";
import {clothing, electronic, furniture, product} from "../models/product.model.js";
import {
    findAllProducts,
    findProduct,
    publishProductByShop,
    queryProducts,
    searchProductByUser,
    unPublishProductByShop,
    updateProductById
} from '../models/repositories/product.repo.js';
import {removeUndefinedObject, updateNestedObject} from "../utils/index.js";

export class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static createProduct(productType, payload) {
        const productClass = ProductFactory.productRegistry[productType];
        if (!productClass) {
            throw new Error(`Unsupported product type: ${productType}`);
        }
        return new productClass(payload).createProduct();
    }

    static updateProduct(productType, productId, payload) {
        const productClass = ProductFactory.productRegistry[productType];
        if (!productClass) {
            throw new Error(`Unsupported product type: ${productType}`);
        }
        return new productClass(payload).updateProduct(productId);
    }

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id});
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id});
    }

    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true};
        return await queryProducts({query, limit, skip});
    }

    static async findAllPublishedForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true};
        return await queryProducts({query, limit, skip});
    }

    static async searchProducts({keySearch}) {
        return await searchProductByUser({keySearch});
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({
                limit, sort, page, filter,
                select: ['product_name', 'product_price', 'product_description', 'product_thumb']
            }
        );
    }

    static async findProduct({product_id}) {
        return await findProduct({product_id, unSelect: ['__v']});
    }
}

// define base product class
class Product {
    constructor({
                    product_name,
                    product_thumb,
                    product_description,
                    product_price,
                    product_quantity,
                    product_type,
                    product_shop,
                    product_attributes
                }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(productId) {
        return await product.create({...this, _id: productId});
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({productId, bodyUpdate, model: product});
    }
}

class ClothingModel extends Product {
    constructor(payload) {
        super(payload);
    }

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) {
            throw new BadRequestError('Failed to create clothing attributes');
        }
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        return newProduct;
    }

    async updateProduct(productId) {
        if (!productId) {
            throw new BadRequestError('Product ID is required for update');
        }

        const objectParams = this;
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({productId, objectParams, model: clothing});
        }

        return await super.updateProduct(productId, objectParams);
    }
}

class ElectronicModel extends Product {
    constructor(payload) {
        super(payload);
    }

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) {
            throw new BadRequestError('Failed to create electronic attributes');
        }
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        return newProduct;
    }

    async updateProduct(productId) {
        if (!productId) {
            throw new BadRequestError('Product ID is required for update');
        }

        let objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObject(objectParams.product_attributes),
                model: electronic
            });
        }

        return await super.updateProduct(productId, updateNestedObject(objectParams));
    }
}

export class FurnitureModel extends Product {
    constructor(payload) {
        super(payload);
    }

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) {
            throw new BadRequestError('Failed to create furniture attributes');
        }
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        return newProduct;
    }

    async updateProduct(productId) {
        if (!productId) {
            throw new BadRequestError('Product ID is required for update');
        }

        const objectParams = this;
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({productId, objectParams, model: furniture});
        }

        return await super.updateProduct(productId, objectParams);
    }
}

ProductFactory.registerProductType('Electronics', ElectronicModel);
ProductFactory.registerProductType('Clothing', ClothingModel);
ProductFactory.registerProductType('Furniture', FurnitureModel);