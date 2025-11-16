'use strict'

import {BadRequestError} from "../core/error.response.js";
import {clothing, electronic, product, furniture} from "../models/product.model.js";

// define factory class to create product
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
}

ProductFactory.registerProductType('Electronics', ElectronicModel);
ProductFactory.registerProductType('Clothing', ClothingModel);
ProductFactory.registerProductType('Furniture', FurnitureModel);