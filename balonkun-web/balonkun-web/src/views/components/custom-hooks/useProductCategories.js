import * as actions from '@redux/actions';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function useProductCategories() {
  const dispatch = useDispatch();

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    dispatch(
      actions.getCategoryListRequest((list) => {
        if (!!(list?.length)) {
          setCategoryList(list);
        }
      })
    );
  }, []);

  return categoryList;
}

export default useProductCategories;
