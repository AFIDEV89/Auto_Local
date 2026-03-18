"use strict";

export const MODULE_TYPE = {
    COLOR: "color",
    PRODUCT: "product",
    USER: "user",
    CATEGORY: "category",
    VEHICLE_DETAIL: "vehicle-detail",
    VEHICLE_TYPE: "vehicle-type",
    BANNER: "banner",
    MATERIAL: "material",
    REVIEW: "review",
    DASHBOARD: "dashboard",
    CART_PRODUCT: "cart-product",
    ADDRESS: "address",
    STORE: "store",
    ORDER: "order",
    ORDER_PRODUCT: "order-product",
    PRODUCT_COLOR: "product-color",
    PRODUCT_MAJOR_COLOR: "product-major-color",
    PRODUCT_MINOR_COLOR: "product-minor-color",
    PRODUCT_MATERIAL: "product-material",
    WEB_SETTING: "web-setting",
    DESIGN: 'design',
    VEHICLE_CATEGORY: 'vehicle-category',
    BRAND: 'brand',
    BRAND_MODEL: 'brand-model',
    PRODUCT_VARIANT: 'product-variant'
};

export const CART_PRODUCT_OPERATION_TYPE = {
    INCREMENT: "increment",
    DECREMENT: "decrement",
};

export const QUERY_TYPE = {
    ADDING: "adding",
    UPDATING: "updating",
    DELETING: "deleting",
    FETCHING: "fetching",
    EXIST: "exist"
};

export const TOKEN_EXPIRY_TYPE = {
    LOGIN: "login",
    VERIFY_EMAIL: "verify-email",
    FORGOT_PASSWORD: 'forgot-password',
};

export const USER_TYPE = {
    USER: "user",
    ADMIN: 'admin',
    EDITOR: 'editor',
    MODERATOR: 'moderator',
};

export const ORDER_STATUS_LIST = {
    NEW_ORDER: "new_order",
    COMPLETED: "completed",
    PROCESSING: "processing",
    PENDING: "pending",
    FAILED: "failed",
    CANCELLED: "cancelled"
};

export const ORDER_PAYMENT_STATUS_LIST = {
    PAID: "paid",
    PENDING: "pending",
    REFUND: "refund",
    FAILED: "failed",
    PROCESSING: "processing",
};

export const ORDER_PAYMENT_TYPE_LIST = {
    CREDIT_CARD: "Credit Card",
    DEBIT_CARD: "Debit Card",
    PAYTM: "Paytm",
    UPI: "Upi",
    NET_BANKING: "Net Banking",
    CASH: "Cash"
};

// export const VEHICLE_TYPE_LIST = {
//     TWO_WHEELER: '1',
//     FOUR_WHEELER: '2',
// };
