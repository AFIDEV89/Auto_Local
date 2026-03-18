export * from "./product";
export * from "./myCart";
export * from "./keys";

export const ROUTES = {
  PRODUCT: '/product',
  PRODUCT_LISTING: '/products',
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  REFUND_POLICY: "/refund-policy",
  ABOUT_US: "/about-us",
  STORE_LOCATOR: "/store-locator"
};

export const MODULES = Object.freeze({
  PAGINATION: {
    INITIAL_DATA: {
      list: [],
      total_count: 0,
    },
    ROWS_PER_PAGE: 12
  },
  FOOTER: {
    LINKS: [
      { title: "About Us", route: ROUTES.ABOUT_US },
      { title: "Terms & Conditions", route: ROUTES.TERMS_AND_CONDITIONS },
      { title: "Privacy Policy", route: ROUTES.PRIVACY_POLICY },
      { title: "Refund Policy", route: ROUTES.REFUND_POLICY },
    ]
  }
});
