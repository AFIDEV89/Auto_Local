export function getActionType(action) {
  return {
    REQUEST: `${action}_REQUEST`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`
  };
};

export * from './Auth';
export * from './Product';
export * from './Banner';
export * from './Vehicle';
export * from './Category';
export * from './StoreAddress';
export * from './MyCart';
export * from './PlacedOrder';
export * from './Blog';
export * from './Pincode';
