export const findFilterSection = (filtersData = [], keyName = "", formValue) => {
    const filter = filtersData.find((filter) => filter.title === keyName);

    return {
        ...filter,
        list: filter.list.map(item => {
            const isValidBrand =
                keyName === "Vehicle Brands" && !!formValue.vehicleType
                    ? formValue.vehicleType === item.vehicle_type_id
                    : true;

            const isValidBrandModel =
                keyName === "Vehicle Models" && !!formValue.vehicleBrand
                    ? formValue.vehicleBrand === item.brand_id
                    : true;

            const isValidBrandModelByVehicleType =
                keyName === "Vehicle Models" && !!formValue.vehicleType
                    ? formValue.vehicleType === item.vehicle_type_id
                    : true;

            const isValidProductSubCategory =
                keyName === "Product Subcategories" && !!formValue.productCategory
                    ? formValue.productCategory === item.category_id
                    : true;

            const isValid = !!formValue.vehicleBrand
                ? !isValidBrand || !isValidBrandModel
                : !isValidBrand ||
                !isValidBrandModel ||
                !isValidBrandModelByVehicleType ||
                !isValidProductSubCategory;

            if (isValid) {
                return false;
            }

            return {
                label: item.title,
                value: item.dbId,
            }
        }).filter(Boolean)
    }
}