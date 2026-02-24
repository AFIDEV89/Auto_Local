import * as constants from "../../constants/index.js";
import * as validations from '../../common/joi.js';
import * as dao from "../../database/dao/index.js";
import {Op} from "sequelize";


export const change_bucket_name = async (req, res) => {
    let old_bucket_name = "https://balonkun"
    let new_bucket_name= "https://autoform-image"
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {

                // console.log(req.body)
                let {table_name,coloumn_name} = req.body
                // console.log(table_name)
                const images = await dao.getRows({
                    tableName: table_name,
                    attributes: ['id',`${coloumn_name}`],
                    query: {
                        id :{ [Op.ne]: null}
                    },
                    raw: true
                });

                    for (let i = 0; i < images.length; i++) {
                        let image = images[i]
                        if(!image[coloumn_name]) {
                            continue
                        }
                        image[coloumn_name] = image[coloumn_name].replace(old_bucket_name,new_bucket_name)
                        let colmName = {}
                        colmName[coloumn_name] = image[coloumn_name]
                        console.log(colmName)
                        await dao.updateRow(table_name, {id:image.id}, colmName);
                    }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};

export const change_bucket_name_in_array = async (req, res) => {
    let old_bucket_name = "https://balonkun"
    let new_bucket_name= "https://autoform-image"
    return validations.validateSchema(
        req,
        res,
        null,
        () => {
            return new Promise(async (resolve, reject) => {

                // console.log(req.body)
                let {table_name,coloumn_name} = req.body
                // console.log(table_name)
                const images = await dao.getRows({
                    tableName: table_name,
                    attributes: ['id',`${coloumn_name}`],
                    query: {
                        id :{ [Op.ne]: null}
                    },
                    raw: true
                });

                for (let i = 0; i < images.length; i++) {
                    let image = images[i]
                    if(!image[coloumn_name]) {
                        continue
                    }
                    //console.log(image[coloumn_name])
                    //image[coloumn_name] = JSON.parse(image[coloumn_name])
                    for (let j = 0; j < image[coloumn_name].length; j++) {
                        image[coloumn_name][j] = image[coloumn_name][j].replace(old_bucket_name,new_bucket_name)


                    }
                    let colmName = {}
                    colmName[coloumn_name] = image[coloumn_name]
                    //console.log(colmName)
                    await dao.updateRow(table_name, {id:image.id}, colmName);
                }

                resolve({});
            });
        },
        constants.CREATION_SUCCESS
    );
};