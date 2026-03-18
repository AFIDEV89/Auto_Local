import * as constants from "../../constants/index.js";
import db from '../index.js';

/**
 * @method getWebsiteBannerList: To get banners according to the user app limit
 * @param {number} limit Fetch data based on this limit
 */
function getWebsiteBannerList(limit) {
  return db[constants.model_values.banner.tableName].findAll({
    attributes: ['title', 'image', 'url'],
    offset: 0,
    limit,
    order: [
      ['updatedAt', 'DESC'],
    ]
  });
};

export { getWebsiteBannerList };
