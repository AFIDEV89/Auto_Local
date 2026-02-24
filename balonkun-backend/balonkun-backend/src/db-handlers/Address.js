"use strict";

import { MODULE_TYPE, QUERY_TYPE } from "../constants/index.js";
import db from "../database/index.js";
import * as Utils from "../utils/index.js";

const AddressModel = db.addresses;

/**
 * @method CreateAddress: To add new address
 * @param {Object} data address detail
 */
export const CreateAddress = (data) => {
    try {
        const {
            store_id,
            name,
            street_address,
            city,
            state,
            postal_code,
            country,
            latitude,
            longitude
        } = data;
        return new Promise(async (resolve) => {
            AddressModel.create({
                store_id,
                name: name.trim(),
                street_address: street_address.trim(),
                city: city.trim(),
                state: state.trim(),
                postal_code,
                country: country.trim(),
                latitude: String(latitude),
                longitude: String(longitude),
            })
                .then((result) => {
                    if (result?.id) {
                        resolve(result);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.ADDING, name: MODULE_TYPE.ADDRESS }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};

/**
 * @method UpdateAddress: To update existing address
 * @param {Object} detail address detail
 */
export const UpdateAddress = (detail) => {
    try {
        const { data, cond } = detail;
        return new Promise(async (resolve) => {
            AddressModel.update(data, { where: cond })
                .then((result) => {
                    if (!!result?.[0]) {
                        resolve(true);
                    } else {
                        resolve(Utils.failureError({ type: QUERY_TYPE.UPDATING, name: MODULE_TYPE.COLOR }));
                    }
                })
                .catch((error) => {
                    resolve(error.message);
                });
        });
    } catch (error) {
        return error.message || error;
    }
};
