import * as constants from "../../constants/index.js";
import * as Utils from '../../utils/index.js';
import db from '../index.js';

/**
 * @method createRow: To add new data entry in the table
 * @param {string} tableName Table name in which you want to add row
 * @param {object} values table row values
 */
function createRow(tableName, values) {
  return db[tableName].create(values);
};

/**
 * @method getRows: To get all rows from the table
 * @param {object<tableName>} tableName Table name in which you want to add row
 * @param {object<query>} query Fetch data based on this condition
 */
async function getRows({ tableName, query, page, limit, attributes = [], include, order = [], raw = false,groupby = null }) {
  const fQuery = {};
  if (Utils.isObject(query)) {
    fQuery.where = query;
  }
  if (Utils.isArray(attributes) || Utils.isObject(attributes)) {
    fQuery.attributes = attributes;
  }
  fQuery.order = !!(order?.length) ? order : [['createdAt', 'DESC']];
  if (Utils.isArray(include)) {
    fQuery.include = include;
  }
  if (raw) {
    fQuery.raw = !!raw;
  }
  if(groupby){
    fQuery.group = groupby
  }

  if (page && limit) {
    const pg = Number(page) - 1, lt = Number(limit);
    fQuery.offset = pg * lt;
    fQuery.limit = lt;
    console.log(tableName)
    const result = await db[tableName].findAndCountAll(fQuery);
    return {
      page: pg + 1,
      limit: lt,
      total_count: result.count,
      no_of_pages: Math.ceil(result.count / lt),
      list: result.rows
    };
  }


  return db[tableName].findAll(fQuery);
};

/**
 * @method updateRow: To update existing entry in the table
 * @param {string} tableName Table name in which you want to add row
 * @param {object} cond Update data based on this condition
 * @param {object} values table row values
 */
function updateRow(tableName, cond, values) {
  return db[tableName].update(values, { where: cond });
};

/**
 * @method deleteRow: To delete existing entry from the table
 * @param {string} tableName Table name in which you want to add row
 * @param {object} cond Update data based on this condition
 */
function deleteRow(tableName, cond) {
  return db[tableName].destroy({ where: cond });
};

/**
 * @method createManyRows: To add new data entry in the table
 * @param {string} tableName Table name in which you want to add row
 * @param {object} values table row values
 */
function createManyRows(tableName, values) {
  return db[tableName].bulkCreate(values)
    .then((result) => {
      if (Utils.isArray(result)) {
        return {
          statusCode: constants.CREATION_SUCCESS,
          message: "Added successfully.",
          data: result
        };
      } else {
        console.log("Error while adding bulk of data: ", result);
        return {
          statusCode: constants.FAILURE,
          message: "Error while adding bulk of data"
        };
      }
    })
    .catch((error) => {
      console.log("Something went wrong: ", error);
      return {
        statusCode: constants.FAILURE,
        message: error.message || "Something went wrong"
      };
    });
};

/**
 * @method getRow: To get specific row from the table
 * @param {string} tableName Table name in which you want to fetch row
 * @param {object} query Fetch data based on this condition
 */
function getRow(tableName, query, include, attributes) {
  const fQuery = { where: query };
  if (Utils.isArray(include)) {
    fQuery.include = include;
  }
  if (Utils.isArray(attributes) || Utils.isObject(attributes)) {
    fQuery.attributes = attributes;
  }
  return db[tableName].findOne(fQuery);
};

export { createRow, createManyRows, updateRow, getRows, getRow, deleteRow };
