import React from 'react';
import { ROUTES } from '../shared/constants';

const DashboardComponent = React.lazy(() => import("../views/dashboard"))
const ProductsPageComponent = React.lazy(() => import("../views/product/listing"));
const BlogComponent = React.lazy(() => import("../views/blog"));
const BlogsComponent = React.lazy(() => import("../views/blog/Blogs"));
const BlogCategoryComponent = React.lazy(() => import("../views/blog/BlogCategory"));
const LoginComponent = React.lazy(() => import("../views/auth/login"))
const ProfileComponent = React.lazy(() => import("../views/auth/profile"))
const AboutUsComponent = React.lazy(() => import("../views/AboutUs"));
const ChangePasswordComponent = React.lazy(() => import("../views/auth/change-password"))
const ConfirmationComponent = React.lazy(() => import("../views/auth/confirmation"));
const ForgotPasswordComponent = React.lazy(() => import("../views/auth/forgot-password"))
const ResetPasswordComponent = React.lazy(() => import("../views/auth/reset-password"));
const SignUpComponent = React.lazy(() => import("../views/auth/sign-up"))
const MyCartComponent = React.lazy(() => import("../views/my-cart"))
const ProductDetailComponent = React.lazy(() => import("../views/product/detail"))
const PrivacyPolicyComponent = React.lazy(() => import("../views/privacyPolicy"))
const RefundPageComponent = React.lazy(() => import("../views/Refund"))
const TermsAndConditionsComponent = React.lazy(() => import("../views/T&C"))
const ThankYouComponent = React.lazy(() => import("../views/thank-you"))
const CareersComponent = React.lazy(() => import("../views/career"))
const ContactUsComponent = React.lazy(() => import("../views/ContactUs"))
const RetailFranchiseComponent = React.lazy(() => import("../views/retailFranchise"))
const OrdersListComponent = React.lazy(() => import("../views/ordersList"))
const ShippingAddressManagementComponent = React.lazy(() => import("../views/ShippingAddressManagement"))
const WishListComponent = React.lazy(() => import("../views/wishlist"));
const StoreLocatorComponent = React.lazy(() => import("../views/store-locator"));

const NotFoundPage = React.lazy(() => import('../views/404'))

export const PAGE_ROUTES = [
  { path: "/", component: DashboardComponent },
  { path: "/login", component: LoginComponent },
  { path: "/signup", component: SignUpComponent },
  { path: "/verify-email/:token", component: ConfirmationComponent },
  { path: "/forgot-password", component: ForgotPasswordComponent },
  { path: "/reset-password/:token", component: ResetPasswordComponent },
  { path: "/products", component: ProductsPageComponent },
  { path: "/:id", component: ProductsPageComponent },
  { path: "/product/:id", component: ProductDetailComponent },
  { path: "/my-cart", component: MyCartComponent, isPrivate: true },
  { path: "/orders", component: OrdersListComponent, isPrivate: true },
  { path: "/thank-you", component: ThankYouComponent, isPrivate: true },
  { path: "/my-profile", component: ProfileComponent, isPrivate: true },
  { path: "/change-password", component: ChangePasswordComponent, isPrivate: true },
  { path: "/edit-profile", component: ProfileComponent, isPrivate: true },
  { path: "/addresses", component: ShippingAddressManagementComponent, isPrivate: true },
  { path: "/wishlist", component: WishListComponent, isPrivate: true },
  { path: ROUTES.TERMS_AND_CONDITIONS, component: TermsAndConditionsComponent, isPrivate: false },
  { path: ROUTES.ABOUT_US, component: AboutUsComponent, isPrivate: false },
  { path: ROUTES.REFUND_POLICY, component: RefundPageComponent, isPrivate: false },
  { path: ROUTES.PRIVACY_POLICY, component: PrivacyPolicyComponent, isPrivate: false },
  { path: "/blog/:id", component: BlogComponent },
  { path: "/blogs", component: BlogsComponent },
  { path: "/blogs/category/:category", component: BlogCategoryComponent },
  { path: "/blogs/category/:category/:pageNumber", component: BlogCategoryComponent },
  { path: "/careers", component: CareersComponent },
  { path: "/contact-us", component: ContactUsComponent },
  { path: "/retail-franchise", component: RetailFranchiseComponent },
  { path: ROUTES.STORE_LOCATOR, component: StoreLocatorComponent },
  { path: "/not-found", component: NotFoundPage },
  { path: "*", component: NotFoundPage }
];
