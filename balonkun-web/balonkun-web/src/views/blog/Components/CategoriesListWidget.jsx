import React, { useEffect, useState } from "react"
import { divider } from "@assets/images";
import { useDispatch } from "react-redux";
import * as actions from '@redux/actions';
import { Link } from "react-router-dom";

const CategoriesListWidget = ({
   title,
   categoriesList = []
}) => {
   const dispatch = useDispatch();
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      if(categoriesList.length === 0) {
         dispatch(
            actions.getCategories({}, (categories) => {
               setCategories(categories)
            })
        );
      }
      else {
         setCategories(categoriesList)
      }

   }, [dispatch]);

   return (
      <div className="categories-list widget">
         <div className="widgetTitleSection">
            <h3>{title}</h3>
            <img src={divider} alt="" />
         </div> 

         <div className="list">
            {
               categories.map((category) => {
                  return (<div className="item" key={category.id}>
                  <Link to={`/blogs/category/${category.id}`}>{category.name}</Link>
                  {/* <span>(2)</span> */}
               </div>)
               })
            }
         </div>
      </div>
   )
}

export default CategoriesListWidget