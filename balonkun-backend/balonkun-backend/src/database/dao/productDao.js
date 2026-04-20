import sequelize from "sequelize";
import { model_values } from "../../constants/index.js";
import * as Utils from '../../utils/index.js';
import db from "../index.js";
import * as dao from './index.js';

/**
 * @method createProductVariants: To create multiple product variants
 * @param {number} product_id Product id whose variants are to be created
 * @param {Array<object>} variants Product variants
 */
async function createProductVariants(product_id, variants) {
  for (const vrt of variants) {
    // creating product variant
    const data = await dao.createRow('productVariants', {
      product_id,
      design_id: vrt.design_id,
      material_id: vrt.material_id,
      major_color_id: vrt.major_color_id,
    });
    if (!!(data?.id)) {
      const mclrs = []; // variant minor colors
      if (!!(vrt?.minor_color_ids?.length)) {
        vrt.minor_color_ids.forEach(mcolid => {
          mclrs.push({
            product_variant_id: data.id,
            minor_color_id: mcolid,
          });
        });
        if (!!mclrs.length) {
          // creating product variants minor colors
          await dao.createManyRows('productVariantMinorColors', mclrs);
        }
      }
    }
  }
}

/**
 * @method updateProductVariants: To update multiple product variants
 * @param {number} product_id Product id whose variants are to be created
 * @param {Array<object>} variants Product variants
 */
async function updateProductVariants(product_id, variants) {
  // deleting product variants
  await deleteProductVariants(product_id);
  // re-creating product variants
  if (!!(variants?.length)) {
    await createProductVariants(product_id, variants);
  }
}

/**
 * @method deleteProductVariants: To delete all product variants
 * @param {number} product_id Product id whose variants are to be created
 */
async function deleteProductVariants(product_id) {
  const savedVariants = await dao.getRows({
    tableName: 'productVariants',
    query: { product_id },
    attributes: ['id']
  });
  if (Utils.isArray(savedVariants)) {
    const savedVariantIds = savedVariants.map(sv => sv.id);
    // deleting product variants minor colors
    const isDeletedMClrs = await dao.deleteRow('productVariantMinorColors', { product_variant_id: { [sequelize.Op.in]: savedVariantIds } });
    // deleting product variants
    // if (isDeletedMClrs) {
    await dao.deleteRow('productVariants', { product_id });
    // }
  }
}

/**
 * @method getUnHideProducts: To get all un-hided products for user app
 * @param {object} data Fetch data based on this data
 */
async function getUnHideProducts({ query, user_id, ...rest }) {
  if (query) {
    query.is_hide = false;
  }
  if (user_id) {
    rest.include.push({
      model: db[model_values.wishlist.tableName],
      where: { user_id },
      required: false
    });
  }

  rest.include = rest.include || [];
  rest.include.push({
    model: db.selectiveShops,
    as: 'ecommerce',
    required: false
  });

  const data = await dao.getRows({ ...rest, tableName: model_values.product.tableName, query });

  const products = JSON.parse(JSON.stringify(data));

  if (products.list) {
    return {
      ...products,
      list: productMapping(products.list)
    };
  } else {
    return productMapping(products);
  }
};

/**
 * @method getWishlistProductDetails: To 
 * @param {object} data Fetch data based on this data
 */
async function getWishlistProductDetails({ query, include, user_id }) {
  if (user_id) {
    include.push({
      model: db[model_values.wishlist.tableName],
      where: { user_id },
      required: false
    });
  }

  include = include || [];
  include.push({
    model: db.selectiveShops,
    as: 'ecommerce',
    required: false
  });

  const details = await dao.getRow(model_values.product.tableName, query, include);

  const product = JSON.parse(JSON.stringify(details));

  return productMapping([product])[0];
};

function productMapping(products) {
  return products.map((product) => {
    const details = {
      ...product,
      isInWishlist: !!(product.wishlists?.length),
      is_saleable: !!(product.ecommerce),
    };
    delete details.wishlists;
    delete details.ecommerce;
    return details;
  });
}

export { createProductVariants, updateProductVariants, deleteProductVariants, getUnHideProducts, getWishlistProductDetails };
