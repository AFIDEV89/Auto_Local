import { USER_TYPE } from 'constants/User';

const menuItems = {
    items: [
        {
            id: "userManagement",
            title: "Manage Users",
            type: "group",
            children: [
                {
                    id: "Users",
                    title: "Users",
                    type: "item",
                    url: "/user-management/users",
                    breadcrumbs: false,
                    allowedRole: [USER_TYPE.admin]
                }
            ]
        },
        {
            id: "application",
            title: "Product Management",
            type: "group",
            children: [
                {
                    id: "Categories",
                    title: "Product Categories",
                    type: "item",
                    url: "/category",
                    breadcrumbs: false,
                },
                {
                    id: "SubCategories",
                    title: "Product SubCategories",
                    type: "item",
                    url: "/Subcategory",
                    breadcrumbs: false,
                },
                {
                    id: "Material",
                    title: "Materials",
                    type: "item",
                    url: "/material",
                    breadcrumbs: false,
                },

                {
                    id: "Design",
                    title: "Designs",
                    type: "item",
                    url: "/design",
                    breadcrumbs: false,
                },

                {
                    id: "Color",
                    title: "Colors",
                    type: "item",
                    url: "/color",
                    breadcrumbs: false,
                },
                {
                    id: "Products",
                    title: "Products",
                    type: "item",
                    url: "/products",
                    breadcrumbs: false,
                }
            ]
        },
        {
            id: "vehicle_management",
            title: "Vehicle Management",
            type: "group",
            children: [
                {
                    id: "Brand",
                    title: "Vehicle Brands",
                    type: "item",
                    url: "/brand",
                    breadcrumbs: false,
                },
                {
                    id: "Brand Model",
                    title: "Vehicle Models",
                    type: "item",
                    url: "/brandModel",
                    breadcrumbs: false,
                },
                {
                    id: "Vehicle Category",
                    title: "Vehicle Categories",
                    type: "item",
                    url: "/vehicleCategory",
                    breadcrumbs: false,
                },
                {
                    id: "Vehicle Data",
                    title: "Vehicle Details",
                    type: "item",
                    url: "/vehicles",
                    breadcrumbs: false,
                }
            ]
        },
        {
            id: "order_System",
            title: "Order Management",
            type: "group",
            children: [
                {
                    id: "Orders",
                    title: "Orders",
                    type: "item",
                    url: "/orders",
                    breadcrumbs: false,
                },
                {
                    id: "Leads",
                    title: "Leads",
                    type: "item",
                    url: "/leads",
                    breadcrumbs: false,
                },
                {
                    id: "Pop Leads",
                    title: "Pop Leads",
                    type: "item",
                    url: "/pop-leads",
                    breadcrumbs: false,
                },
                {
                    id: "Franchise Leads",
                    title: "Franchise Leads",
                    type: "item",
                    url: "/franchise-leads",
                    breadcrumbs: false,
                },
                {
                    id: "Stores",
                    title: "Stores",
                    type: "item",
                    url: "/stores",
                    breadcrumbs: false,
                },
                {
                    id: "StoreLocator",
                    title: "Store Locator",
                    type: "item",
                    url: "/store-locator",
                    breadcrumbs: false,
                },
                {
                    id: "ShopRegistry",
                    title: "Shop Management",
                    type: "item",
                    url: "/online-shop/registry",
                    breadcrumbs: false,
                }
            ]
        },
        {
            id: "mis",
            title: "Blog Management",
            type: "group",
            children: [

                {
                    id: "Blogs",
                    title: "Blogs",
                    type: "item",
                    url: "/blogs",
                    breadcrumbs: false,
                },
                {
                    id: "BlogsCategory",
                    title: "Blogs Category",
                    type: "item",
                    url: "/blogsCategory",
                    breadcrumbs: false,
                },
                {
                    id: "BlogsHeader",
                    title: "Blogs Header",
                    type: "item",
                    url: "/blogsHeader",
                    breadcrumbs: false,
                },
                {
                    id: "Testimonials",
                    title: "Testimonials",
                    type: "item",
                    url: "/testimonials",
                    breadcrumbs: false,
                }
            ]
        },
        {
            id: "seo",
            title: "SEO",
            type: "group",
            children: [
                {
                    id: "URLs",
                    title: "URLs",
                    type: "item",
                    url: '/seo/urls-management',
                    breadcrumbs: false,
                },
                {
                    id: "Banner",
                    title: "Banners",
                    type: "item",
                    url: "/banner",
                    breadcrumbs: false,
                }
            ]
        }
    ]
};

export default menuItems;
