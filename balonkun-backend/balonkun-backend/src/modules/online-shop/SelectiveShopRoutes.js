"use strict";

import express from 'express';
import * as SelectiveShopController from './SelectiveShopController.js';

const router = express.Router();

/**
 * Registry Management Routes (Admin Only)
 */
router.post(
    '/ecommerce-shop',
    SelectiveShopController.addToShop
);

router.post(
    '/ecommerce-shop/bulk',
    SelectiveShopController.bulkAddToShop
);

router.delete(
    '/ecommerce-shop/:product_id',
    SelectiveShopController.removeFromShop
);

router.get(
    '/ecommerce-shop',
    SelectiveShopController.getShopRegistry
);

export const SelectiveShopRoutes = router;
