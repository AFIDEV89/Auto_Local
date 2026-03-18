import {getUserProductCategoryList} from "../../product-categories/ProductCategoryController.js";
import * as dao from "../../../database/dao/index.js";
import * as constants from "../../../constants/index.js";
import {getVehicleDetailLists} from "../../vehicle-details/VehicleDetailController.js";
import {getDesignsList} from "../../designs/DesignController.js";
import { getMaterialsList} from "../../materials/MaterialController.js";
import { getColorsList} from "../../colors/ColorController.js";
import {get_create_vehicle_detail_id} from "./vehilce_data_controller.js";


let categoryList
let vehicleCategoryList
let vehicleDetailList
let designList
let materialList
let colors

export async function createBulkUpload(data) {



    // console.log(vehicleDetailList)
    let result =  []
    for (const data1 of data) {
            result.push(await uploadSingleEntry(data1))
        }
    return result
}

export async function uploadSingleEntry(data) {
    let data_to_save = {}
    data_to_save.category_id = await get_product_category_id(data['category']);
    data_to_save.additional_info= data.additional_info;
    data_to_save.availability= 'yes';
    data_to_save.description= data.description;
    data_to_save.detail= data.details;
    // data_to_save.discounted_price= data.discounted_price;
    data_to_save.is_latest= data.latest;
    data_to_save.is_trending= data.trending;
    data_to_save.name= data.name;
    data_to_save.original_price= data.original_price;
    if(!data_to_save.original_price) {
        data_to_save.original_price = 0
    }
    data_to_save.pictures = data.pictures;
    data_to_save.product_code = data.product_code;
    data_to_save.vehicle_details_id = await get_create_vehicle_detail_id(data)    // console.log(data_to_save.vehicle_details_id)
    // in case vehicle not mapped to existing one
    if(data_to_save.vehicle_details_id.error) {
        console.log(data)
        console.log("vehicle not found")
        return data_to_save.vehicle_details_id
    }
    data_to_save.quantity = data.quantity
    data_to_save.ratings = data.ratings
    data_to_save.reviews = data.reviews;
    //check seo_canonical

    data_to_save.seo_canonical = data.seo_canonical;
    data_to_save.seo_description = data.seo_description;
    data_to_save.seo_title = data.seo_title;
    data_to_save.suggestions = data.suggestions;
    data_to_save.tags = data.tags;
    data_to_save.videos = data.videos;
    console.log(data['category'])
    console.log("data_to_save "+JSON.stringify(data_to_save, null, 2));
    const product_detail = await dao.createRow(constants.model_values.product.tableName, data_to_save)
    // data_to_save.vehicle_type_id = data_to_save.vehicle_details_id.vehicle_type_id;

    await add_variant_id(product_detail,data)
}

async function map_minor_colors(product_variant_detail,minor_colors) {
    if (product_variant_detail?.id) {
        for (let color of minor_colors) {
           var id =  await get_color_id(color)
            if (id) {
                const product_variant_minor_colors_to_save = {
                    product_variant_id: product_variant_detail.id,
                    minor_color_id: id,
                };
                console.log(minor_colors+"  "+product_variant_minor_colors_to_save);
                await dao.createRow(constants.model_values.product_variant_minor_colors.tableName, product_variant_minor_colors_to_save);

            }else {
                console.log(color +" not found" )
            }
        }
          }
}
async function add_variant_id(product_details,data) {
    const productVariantToSave = {
        product_id: product_details.id,
        design_id: await get_design_id(data.design),
        material_id: await get_material_id(data.design_material),
        major_color_id: await get_color_id(data.majorcolor)
    };
    const productVariantDetail = await dao.createRow(constants.model_values.product_variants.tableName, productVariantToSave);
    console.log(productVariantDetail);
    await map_minor_colors(productVariantDetail,data.minorcolor?.split(/,\s*/))
}

async function get_color_id(color) {
    if (colors == null) {
        colors = await dao.getRows({
            tableName: constants.model_values.color.tableName,
            query:{}
        })
    }
    let color1= colors.filter(color1 => {
        return color1.dataValues.name.toUpperCase() === color.toUpperCase()
    })
    if(color1 && color1[0]) {
        return color1[0].id
    }else {
        return null
    }
}

async function get_vehicle_detail_id(vehicle_detail) {
    if (vehicleDetailList == null) {
        vehicleDetailList = await getVehicleDetailLists();
    }
    let vehicle_detail_result = vehicleDetailList.filter(vehicle => {
        // if(vehicle_detail.vehicle_type ==="4W" &&  vehicle_detail.brand === "Hyundai" && vehicle_detail.model === "EON") {
        //     console.log(vehicle.vehicle_type?.dataValues.name + " " + vehicle.brand?.dataValues.name + " " + vehicle.brand_model?.dataValues.name)
        //     console.log("failed"+JSON.stringify(vehicle, null, 2));
        //     // console.log((vehicle_detail.vehicle_type.toUpperCase() === vehicle.vehicle_type?.dataValues.name.toUpperCase())
        //     //     && (vehicle_detail.vehicle_category === vehicle.vehicle_category?.dataValues.name)
        //         // && (vehicle_detail.brand.toUpperCase() === vehicle.brand?.dataValues.name.toUpperCase())
        //         // && (vehicle_detail.model.toUpperCase() === vehicle.brand_model?.dataValues.name.toUpperCase()))
        // }


        return (vehicle_detail.vehicle_type.toUpperCase()===vehicle.vehicle_type?.dataValues.name.trim().toUpperCase())
            // && (vehicle_detail.vehicle_category===vehicle.vehicle_category?.dataValues.name)
            && (vehicle_detail.brand.toUpperCase()===vehicle.brand?.dataValues.name.trim().toUpperCase())
            && (vehicle_detail.model.toUpperCase()===vehicle.brand_model?.dataValues.name.trim().toUpperCase())
            // && (vehicle_detail.model_variant===vehicle.dataValues.model_variant)
            // && (vehicle_detail.month===vehicle.dataValues.month)
            // && (vehicle_detail.year===vehicle.dataValues.year)
    })
     // console.log(vehicle_detail)
     // console.log(vehicle_detail_result)
    if( vehicle_detail_result && vehicle_detail_result[0]) {
        return  vehicle_detail_result[0].dataValues.id
    }else {

        return  {
            error: 'error',
            message: 'Vehicle Mapping Not Exist',
            data: vehicle_detail_result,
        }

    }
}

function get_seo_canonical(seo_canonical) {
    if(seo_canonical == null){

    }
}

async function get_design_id(design_id) {
    if (designList == null) {
        designList = await getDesignsList()
    }
    let design= designList.filter(design => {
        console.log(design.dataValues)
        return design.dataValues.name.trim().toUpperCase() === design_id.trim().toUpperCase()
    })
    if(design && design[0]) {
        return design[0].id
    }else {
        return null
    }
}

async function get_material_id(material) {
    if (materialList == null) {
        materialList = await getMaterialsList()
    }
    let material_data = materialList.filter(material1 => {
        return material1.dataValues.name.toUpperCase() === material.toUpperCase()
    })
    if(material_data && material_data[0]) {
        return material_data[0].id
    }else {
        return null
    }
}

async function get_product_category_id(category) {
    if (categoryList == null) {
        categoryList = await dao.getRows({
            tableName: constants.model_values.product_category.tableName,attributes: ['id','name'],
        })
    }
    let category_data = categoryList.filter(categorys => {
        return categorys.dataValues.name === category.trim()
    })
    if(category_data && category_data[0]) {
        return category_data[0].id
    }else {
        return null
    }
}


