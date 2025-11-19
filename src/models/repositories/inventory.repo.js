'use strict'

import {inventory} from "../inventory.model.js";
import mongoose from 'mongoose';

const {Types} = mongoose;

export const insertInventory = async ({productId, shopId, stock, location = 'unknown'}) => {
    return await inventory.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_location: location,
        inven_stock: stock
    });
}