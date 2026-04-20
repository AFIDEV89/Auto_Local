// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;
export const GoogleMap_API = process.env.REACT_APP_GOOGLE_API_KEY;
export const videoSize = 5000000;
export const base_url = process.env.REACT_APP_API_BASE_URL;

export const getProductPicture = (product) => {
  const productImage = product?.pictures?.[0];
  const designImage = (product.product_variants?.find(variant => !!(variant?.design?.pictures?.length))?.design?.pictures[0]) || '';
  return productImage || designImage;
};

export const getProductPrice = (product) => {
  return product.discounted_price || product.original_price;
};

export const getProductPictures = (product) => {
  const pictures = [];

  if (!!(product?.pictures?.length)) {
    product.pictures.forEach(element => {
      pictures.push({ src: element, type: 'image' });
    });
  }

  if (product?.product_variants?.[0]?.design?.pictures?.length) {
    product.product_variants[0].design.pictures.forEach(imag => {
      pictures.push({ src: imag, type: 'image' });
    });
  }

  return pictures;
};
