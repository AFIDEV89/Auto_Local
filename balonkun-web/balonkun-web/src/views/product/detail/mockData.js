export const infoTabs = [
  {
    id: 1,
    tabName: 'Description',
    shouldRender: () => true
  },
  {
    id: 2,
    tabName: 'Additional Info',
    shouldRender: () => true
  },
  {
    id: 3,
    tabName: 'Related Products',
    shouldRender: (product) => product.category_id !== 1
  },
  {
    id: 4,
    tabName: 'Related Mats',
    shouldRender: (product) => product.category_id === 1
  },
  {
    id: 5,
    tabName: 'Related Accessories',
    shouldRender: (product) => product.category_id === 1
  },
  {
    id: 6,
    tabName: 'Reviews',
    shouldRender: () => true
  }
];