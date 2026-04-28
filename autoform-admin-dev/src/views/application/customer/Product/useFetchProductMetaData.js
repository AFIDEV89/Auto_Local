import API from "api/axios";
import { useEffect, useState } from "react";

const useFetchProductMetaData = () => {
    const [productMetaData, setProductMetaData] = useState({
        designList: [],
        vehicleCategoryList: [],
        materialList: [],
        colorList: [],
        vehicleList: [],
        categoryList: [],
        SubCategoryList: [],
        vehicles: []
    });

    const fetchData = async () => {
        const responses = await Promise.allSettled([
            API.get("design/get-list"),
            API.get("vehicle-category/get-list"),
            API.get("material/get-list"),
            API.get("color/get-list"),
            API.get("vehicle-detail/get-list"),
            API.get("category/get-list"),
            API.get("subcategory/get-list"),
            API.get("vehicle-detail/vehicle-types")
        ]);

        const [
            designList,
            vehicleCategoryList,
            materialList,
            colorList,
            vehicleList,
            categoryList,
            SubCategoryList,
            vehicleTypesList
        ] = responses.map(e => e.status === "fulfilled" ? e?.value?.data?.data : []);

        setProductMetaData((prev) => ({
            ...prev,
            designList,
            vehicleCategoryList,
            materialList: materialList.reverse(),
            colorList: colorList.reverse(),
            vehicleList: vehicleList.reverse(),
            categoryList: categoryList.reverse().map(e => ({ ...e, filter_type: 'product_category' })),
            SubCategoryList: SubCategoryList.reverse().map(e => ({ ...e, filter_type: 'product_subcategory' })),
            vehicles: vehicleTypesList.map(e => ({ ...e, filter_type: 'vehicle_type' }))
        }))
    }

    useEffect(() => {
        fetchData();
    }, [])

    return productMetaData
}

export default useFetchProductMetaData;