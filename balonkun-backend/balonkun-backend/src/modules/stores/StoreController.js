"use strict";
import Sequelize from "sequelize";
import * as validations from '../../common/joi.js';
import messages from '../../common/messages/content.js';
import * as constants from '../../constants/index.js';
import * as dao from "../../database/dao/index.js";
import db from '../../database/index.js';
import * as Validator from './StoreValidations.js';

/**
 * @method createStore: To add new store
 * @param {Object} req request object
 * @param {Object} res response object
 */
function createStore(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.createStore,
    async () => {
      const saveToStore = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        contact_no: req.body.contact_no.trim()
      };
      const store = await dao.createRow(constants.model_values.store.tableName, saveToStore);
      if (store?.id) {
        const saveToAddress = {
          store_id: store.id,
          street_address: req.body.street_address.trim(),
          city: req.body.city.trim(),
          state: req.body.state.trim(),
          postal_code: req.body.postal_code,
          country: req.body.country.trim(),
          latitude: String(req.body.latitude),
          longitude: String(req.body.longitude),
        };
        const address = await dao.createRow(constants.model_values.address.tableName, saveToAddress);
        return { ...store.toJSON(), address };
      }
      return store;
    },
    constants.CREATION_SUCCESS,
    messages.stores.create
  );
};

/**
 * @method getStoreList: To get store list
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getStoreList(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.getStoreList,
    async () => {
      const range = [40, 100, 300];
      const queryConfig = {
        tableName: constants.model_values.store.tableName,
        ...req.query,
        include: [{
          model: db.addresses,
          required: true
        }],
      };
      if (req.query.latitude && req.query.longitude) {
        queryConfig.attributes = [
          'id',
          'name',
          'email',
          'contact_no',
          'createdAt',
          'updatedAt',
          [
            Sequelize.literal(`(
          6371 * acos(
            cos(radians(${req.query.latitude})) * cos(radians(address.latitude)) *
            cos(radians(${req.query.longitude}) - radians(address.longitude)) +
            sin(radians(${req.query.latitude})) * sin(radians(address.latitude))
          )
        )`),
            'distance'
          ]
        ];
        queryConfig.order = [[Sequelize.literal('distance'), 'ASC']];

        // fetching nearest stores of user location
        for (let distance of range) {
          queryConfig.query = Sequelize.literal(`
        6371 * acos(
          cos(radians(${req.query.latitude})) * cos(radians(address.latitude)) *
          cos(radians(${req.query.longitude}) - radians(address.longitude)) +
          sin(radians(${req.query.latitude})) * sin(radians(address.latitude))
        ) < ${distance}
      `);
          const stores = await dao.getRows(queryConfig);
          if (!!(stores?.length)) {
            return stores;
          }
        }
      }

      // fetching all the stores
      return await dao.getRows(queryConfig);
    },
    constants.GET_SUCCESS,
    messages.stores.get_list
  );
};

/**
* @method updateStore: To update existing store
* @param {Object} req request object
* @param {Object} res response object
*/
function updateStore(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.updateStore,
    async () => {
      const updateToStore = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        contact_no: req.body.contact_no.trim()
      };
      const result = await dao.updateRow(constants.model_values.store.tableName, { id: req.params.id }, updateToStore);
      if (!!result?.[0]) {
        const updateToAddress = {
          street_address: req.body.street_address.trim(),
          city: req.body.city.trim(),
          state: req.body.state.trim(),
          postal_code: req.body.postal_code,
          country: req.body.country.trim(),
          latitude: String(req.body.latitude),
          longitude: String(req.body.longitude),
        };
        await dao.updateRow(constants.model_values.address.tableName, { store_id: req.params.id }, updateToAddress);
      }
      return {};
    },
    constants.UPDATE_SUCCESS,
    messages.stores.update
  );
};

/**
* @method deleteStore: To delete existing store
* @param {Object} req request object
* @param {Object} res response object
*/
function deleteStore(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.deleteStore,
    () => dao.deleteRow(constants.model_values.store.tableName, { id: req.params.id }),
    constants.DELETE_SUCCESS,
    messages.stores.delete
  );
};

/**
 * @method getStore: To get store details
 * @param {Object} req request object
 * @param {Object} res response object
 */
function getStore(req, res) {
  return validations.validateSchema(
    req,
    res,
    Validator.getStore,
    () => dao.getRow(constants.model_values.store.tableName, { id: req.params.id }, [{ model: db.addresses }]),
    constants.GET_SUCCESS,
    messages.stores.get
  );
};

export { createStore, getStoreList, updateStore, deleteStore, getStore };
