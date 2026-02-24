const getProductPicture = (product) => {
  const productImage = product?.pictures?.[0];
  const designImage = (product.product_variants?.find(variant => !!(variant?.design?.pictures?.length))?.design?.pictures[0]) || '';
  return  productImage || designImage ;
}

const getProductPictures = (product) => {
  if (!!(product?.pictures?.length)) {
    return product.pictures;
  }

  const designPictures = product.product_variants
      ?.map(variant => variant?.design?.pictures || null)
      ?.filter(Boolean)
      ?.filter(image => !!(JSON.parse(JSON.stringify(image))?.length))
      ?.reduce((acc, curr) => acc.concat(curr), []);

  if (!!(designPictures?.length)) {
    return designPictures;
  }
  return [];
}

const getProductPrice = (product) => {
  return product.discounted_price || product.original_price;
}

const allowedFiltersMapping = {
  "Product Categories": "c_id",
  "Vehicle Brands": "v_b_id",
  "Vehicle Models": "v_m_id",
  "Vehicle Types": "v_id",
  "Product Subcategories": "sc_id",
};

const getFilterString = (selectedFilters) => {
  const params = [];

  Object.keys(allowedFiltersMapping).forEach((key) => {
    if (selectedFilters && selectedFilters[key] && selectedFilters[key].length === 1) {
      params.push(`${allowedFiltersMapping[key]}=${selectedFilters[key][0]}`)
    }
  });

  return params.join("&");
}

export { 
  getProductPicture, 
  getProductPictures, 
  getProductPrice, 
  getFilterString 
};
