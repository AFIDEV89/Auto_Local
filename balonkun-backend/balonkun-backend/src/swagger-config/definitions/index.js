"use strict";
import Category from "./Category.js";
import Color from "./Color.js";
import Product from "./Product.js";
import User from "./User.js";
import VehicleDetails from "./VehicleDetails.js";
import Banner from "./Banner.js";
import Material from "./Material.js";
import Review from "./Review.js";
import CartProduct from "./CartProduct.js";
import Common from "./Common.js";
import Address from "./Address.js";
import Store from "./Store.js";
import Order from "./Order.js";
import WebSetting from "./WebSetting.js";
import Design from "./Design.js";
import VehicleCategory from "./VehicleCategory.js";
import Brand from "./Brand.js";
import BrandModel from "./BrandModel.js";
import { BlogDefinitions } from "../../modules/blogs/swagger/index.js";
import { BlogCategoryDefinitions } from "../../modules/blog-categories/swagger/index.js";

export default {
    ...User,
    ...Product,
    Category,
    Color,
    ...VehicleDetails,
    ...Banner,
    Material,
    Review,
    ...CartProduct,
    ...Common,
    ...Address,
    ...Store,
    ...Order,
    ...WebSetting,
    ...Design,
    ...VehicleCategory,
    ...Brand,
    ...BrandModel,
    ...BlogDefinitions,
    ...BlogCategoryDefinitions
};
