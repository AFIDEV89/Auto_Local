"use strict";

export * from "./Modules.js";
export * from "./Routes.js";
export * from './responses.js';
export * from './DummyData.js';


export const model_values = Object.freeze({
  product: {
    tableName: 'products',
    availability: ['yes', 'no'],
    admin_listing_filters: {
      vehicle_type: 'vehicle_type',
      product_category: 'product_category',
    }
  },
  product_variants: {
    tableName: 'productVariants',
  },
  product_variant_minor_colors: {
    tableName: 'productVariantMinorColors',
  },
  product_category: {
    tableName: 'categories'
  },
  product_comments: {
    tableName: 'productComments'
  },
  brand_model: {
    tableName: 'brandModels'
  },
  vehicle_category: {
    tableName: 'vehicle_categories'
  },
  design: {
    tableName: 'designs'
  },
  material: {
    tableName: 'materials'
  },
  color: {
    tableName: 'colors'
  },
  brand: {
    tableName: 'brands'
  },
  vehicle_type: {
    tableName: 'vehicleTypes'
  },
  vehicle_detail: {
    tableName: 'vehicleDetails'
  },
  banner: {
    tableName: 'banners'
  },
  web_setting: {
    tableName: 'webSettings'
  },
  blog_category: {
    tableName: 'blogCategories'
  },
  blog_authors: {
    tableName:'blogAuthors'
  },
  store: {
    tableName: 'stores'
  },
  address: {
    tableName: 'addresses'
  },
  review: {
    tableName: 'review'
  },
  order: {
    tableName: 'orders'
  },
  cart: {
    tableName: 'cartProducts'
  },
  orderProduct: {
    tableName: 'orderProducts'
  },
  user: {
    tableName: 'users'
  },
  product_price: {
    tableName: 'productPrices'
  },
  wishlist: {
    tableName: 'wishlists',
  },

  seo_data_mapping: {
    tableName:'seoMappings'
  },

  user_address: {
    tableName:'useraddresses'},
  leads: {
    tableName:'leadDatas'},
  selective_shop: {
    tableName: 'ecommerce_shop_registry'
  },
});
