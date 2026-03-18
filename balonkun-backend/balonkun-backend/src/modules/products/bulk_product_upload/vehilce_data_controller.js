import * as dao from "../../../database/dao/index.js";
import * as constants from "../../../constants/index.js";

export async function get_create_vehicle_detail_id(data) {
    let vehicle_type_id = await get_vehicle_type_id(data.vehicle_type);
    let vehicle_brand_id = await get_vehicle_brand_id(data.brand);
    if(!vehicle_brand_id) {
        vehicle_brand_id = await create_vehicle_brand(data.brand, vehicle_type_id);
    }
    // if(!vehicle_brand_id) {
    //     try {
    //
    //          }catch (error ) {
    //         console.log(error)
    //     }
    //
    // }
    let vehicle_model_id = await get_vehicle_model_id(data.vehicle_details);
    if(!vehicle_model_id) {
        vehicle_model_id = await create_vehicle_model(vehicle_brand_id, data.vehicle_details, vehicle_type_id);
    }

    // if(!vehicle_model_id) {
    //     try {
    //              }catch (error ) {
    //         console.log(error)
    //     }
    // }
    let vehicle_detail_id = await get_vehicle_detail_id(vehicle_type_id,vehicle_model_id,vehicle_brand_id)
    if(!vehicle_detail_id) {
        vehicle_detail_id = await create_vehicle_detail_id(vehicle_type_id,vehicle_model_id,vehicle_brand_id)
    }
    return vehicle_detail_id;
}
async function create_vehicle_detail_id(vehicle_type_id,vehicle_model_id,vehicle_brand_id){
    let vehicle_type = await dao.createRow(
        constants.model_values.vehicle_detail.tableName, {
            vehicle_type_id:vehicle_type_id,brand_id:vehicle_brand_id,model_id:vehicle_model_id
        }
    )
    return vehicle_type.id
}
async function get_vehicle_detail_id(vehicle_type_id,vehicle_model_id,vehicle_brand_id){
    let vehicle_type = await dao.getRow(
        constants.model_values.vehicle_detail.tableName,{
            vehicle_type_id:vehicle_type_id,brand_id:vehicle_brand_id,model_id:vehicle_model_id
        }
    )
    if(vehicle_type)
        return vehicle_type.id
    else {
        return null;
    }
}
let vehicle_type
let vehicle_brands
let vehicle_models
async function get_vehicle_type_id(vehicle_category) {
    if (vehicle_type == null) {
        vehicle_type = await dao.getRows({
            tableName: constants.model_values.vehicle_type.tableName,attributes: ['id','name'],
        })
    }
    let category_data = vehicle_type.filter(categorys => {
        return categorys.dataValues.name === vehicle_category.trim()
    })
    if(category_data && category_data[0]) {
        return category_data[0].id
    }else {
        return null
    }
}
async function get_vehicle_brand_id(vehicle_brand) {
    if (vehicle_brands == null) {
        vehicle_brands = await dao.getRows({
            tableName: constants.model_values.brand.tableName,attributes: ['id','name'],
        })
    }
    let brand_data = vehicle_brands.filter(brands => {
        return brands.dataValues.name.toLowerCase() === vehicle_brand.toLowerCase().trim()
    })
    if(brand_data && brand_data[0]) {
        return brand_data[0].id
    }else {
        return null
    }
}
async function get_vehicle_model_id(vehicle_model) {
    if (vehicle_models == null) {
        vehicle_models = await dao.getRows({
            tableName: constants.model_values.brand_model.tableName,attributes: ['id','name'],
        })
    }
    let model_data = vehicle_models.filter(models => {
        return models.dataValues.name.toLowerCase() === vehicle_model.toLowerCase().trim()
    })
    if(model_data && model_data[0]) {
        return model_data[0].id
    }else {
        return null
    }
}
async function create_vehicle_brand(vehicle_brand,vehicle_type_id) {
    let vehicle_brand_data = await dao.createRow(constants.model_values.brand.tableName, {name:vehicle_brand,vehicle_type_id:vehicle_type_id});
    vehicle_brands = null;
    return vehicle_brand_data.id

}
async function create_vehicle_model(vehicle_brand_id,vehicle_model,vehicle_type_id) {
    let vehicle_model_data = await dao.createRow(constants.model_values.brand_model.tableName, {name:vehicle_model,vehicle_type_id:vehicle_type_id,brand_id:vehicle_brand_id});
    vehicle_models = null;
    return vehicle_model_data.id

}
