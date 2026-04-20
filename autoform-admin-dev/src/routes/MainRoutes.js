import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { PermissionProvider } from 'contexts/PermissionContext';
import PermissionGuard from 'utils/route-guard/PermissionGuard';
import { USER_TYPE } from 'constants/User';


// application e-commerce pages
const AppECommProducts = Loadable(lazy(() => import('views/application/e-commerce/Products')));
const AppECommProductDetails = Loadable(lazy(() => import('views/application/e-commerce/ProductDetails')));
const AppECommCategoryList = Loadable(lazy(() => import('views/application/e-commerce/CategoryList')));
const AppECommSubCategoryList = Loadable(lazy(() => import('views/application/e-commerce/SubCategory')));
const AppECommBlogsList = Loadable(lazy(() => import('views/application/blogs/blogs')));
const AppBlogCategoryList = Loadable(lazy(() => import('views/application/blogsCategory/blogsCategory')))
const AppBlogHeader = Loadable(lazy(() => import('views/application/blogsHeader/blogsHeader')))
const AppTestimonials = Loadable(lazy(() => import('views/application/testimonials/TestimonialsList')))
const AppECommBrandList = Loadable(lazy(() => import('views/application/brand/brand')));
const AppECommDesignList = Loadable(lazy(() => import('views/application/design/design')));
const AppECommBrandModelList = Loadable(lazy(() => import('views/application/brandModel/brandModel')));

const AppECommVehiclesList = Loadable(lazy(() => import('views/application/e-commerce/vehiclesData')));
const AppECommVehiclesCategory = Loadable(lazy(() => import('views/application/vehicleCategory/vehicleCategory')));

const AppStore = Loadable(lazy(() => import('views/application/e-commerce/Store')));
const AppStoreLocator = Loadable(lazy(() => import('views/application/store-locator/StoreLocatorList')));
const AppCustomerOrderList = Loadable(lazy(() => import('views/application/customer/OrderList/index')));
const AppCustomerLeadsList = Loadable(lazy(() => import('views/application/customer/Leads/index')));
const AppPopLeadsList = Loadable(lazy(() => import('views/application/customer/PopLeads/index')));
const AppFranchiseLeadsList = Loadable(lazy(() => import('views/application/customer/FranchiseLeads/index')));
const AppShopRegistry = Loadable(lazy(() => import('views/application/order-management/ShopRegistry')));

// application material & color
const MaterialList = Loadable(lazy(() => import('views/application/e-commerce/Material/MaterialList')));
const ColorList = Loadable(lazy(() => import('views/application/e-commerce/ColorList/ColorList')));
const BannerTab = Loadable(lazy(() => import('views/application/e-commerce/BannerTab')));


// SEO
const SEOUrlsPage = Loadable(lazy(() => import('views/application/seo/seoUrls')))

// User Management
const UserManagement = Loadable(lazy(() => import('views/application/userManagement')))

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <PermissionProvider>
                <MainLayout />
            </PermissionProvider>
        </AuthGuard>
    ),
    children: [
        {
            path: '/material',
            element: <MaterialList />
        },
        {
            path: '/color',
            element: <ColorList />
        },

        {
            path: '/orders',
            element: <AppCustomerOrderList />
        },
        {
            path: '/leads',
            element: <AppCustomerLeadsList />
        },
        {
            path: '/pop-leads',
            element: <AppPopLeadsList />
        },
        {
            path: '/franchise-leads',
            element: <AppFranchiseLeadsList />
        },
        {
            path: '/products',
            element: <AppECommProducts />
        },
        {
            path: '/product-details/:id',
            element: <AppECommProductDetails />
        },
        {
            path: '/category',
            element: <AppECommCategoryList />
        },
        {
            path: '/subCategory',
            element: <AppECommSubCategoryList />
        },
        {
            path: '/blogs',
            element: <AppECommBlogsList />
        },
        {
            path: '/blogsCategory',
            element: <AppBlogCategoryList />
        },
        {
            path: '/blogsHeader',
            element: <AppBlogHeader />
        },
        {
            path: '/testimonials',
            element: <AppTestimonials />
        },
        {
            path: '/brand',
            element: <AppECommBrandList />
        },
        {
            path: '/brandModel',
            element: <AppECommBrandModelList />
        },
        {
            path: '/vehicles',
            element: <AppECommVehiclesList />
        },
        {
            path: '/vehicleCategory',
            element: <AppECommVehiclesCategory />
        },
        {
            path: '/design',
            element: <AppECommDesignList />
        },
        {
            path: '/stores',
            element: <AppStore />
        },
        {
            path: '/store-locator',
            element: <AppStoreLocator />
        },
        {
            path: '/online-shop/registry',
            element: <AppShopRegistry />
        },
        {
            path: '/banner',
            element: <BannerTab />
        },
        {
            path: '/seo/urls-management',
            element: <SEOUrlsPage />
        },
        {
            path: '/user-management/users',
            element: (<PermissionGuard allowedRole={[USER_TYPE.admin]}>
                <UserManagement />
            </PermissionGuard>)
        }
    ]
};

export default MainRoutes;
