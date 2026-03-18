export const sortByFilter = [
  {
    label: 'Price',
    options: [
      { label: 'Low to high', value: '1', metaData: { sort_by: 'original_price', sort_order: 'ASC' } },
      { label: 'High to low', value: '2', metaData: { sort_by: 'original_price', sort_order: 'DESC' } }]
  },
  { label: 'Latest', value: '3', metaData: { filter_by: 'latest' } }
];
