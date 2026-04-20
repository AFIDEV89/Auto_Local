// project imports
import React, { useState, useEffect } from 'react';
import Accordion from 'ui-component/extended/Accordion';

// ==============================|| PRODUCT DETAILS - DESCRIPTION ||============================== //

const ProductDescription = ({ product }) => {
    // accordion data
    const { description, additional_info } = product;
    const [descArr, setDescArr] = useState([]);

    useEffect(() => {


        const descriptionData = [
            {
                id: 'basic1',
                defaultExpand: true,
                title: 'Specification',
                content: description,
            },
            {
                id: 'basic2',
                title: 'Additional Info',
                content: additional_info,

            }
        ];

        setDescArr(descriptionData);

    }, [description, additional_info]);




    return <Accordion data={descArr} />;

};

export default ProductDescription;
