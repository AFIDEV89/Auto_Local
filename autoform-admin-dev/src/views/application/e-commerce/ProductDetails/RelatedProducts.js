import PropTypes from 'prop-types';
// material-ui
import { Box } from '@mui/material';

// third-party
import Slider from 'react-slick';

// project imports
import ProductCard from 'ui-component/cards/ProductCard';
import { useNavigate } from 'react-router';

// ==============================|| PRODUCT DETAILS - RELATED PRODUCTS ||============================== //

const RelatedProducts = ({ id, relatedProduct }) => {
    const history = useNavigate();


    let productCount = relatedProduct.length < 4 ? relatedProduct.length : 4;
    var settings = {
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        slidesToShow: productCount,
        responsive: [
            {
                breakpoint: 680,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    let productResult = <></>;

    if (relatedProduct) {
        productResult = relatedProduct.map((product, index) => (
            <Box
                onClick={() => {
                    history(`/product-details/${product?.id}`);

                }
                }
                key={index} sx={{ p: 1.5 }}>
                <ProductCard
                    key={index}
                    id={product.id}
                    image={product?.pictures?.[0]}
                    name={product?.name}
                    offerPrice={product?.discounted_price>0 ? product?.discounted_price : product?.original_price}
                    salePrice={product?.original_price}
                    isShowOrignalPrice={product?.discounted_price>0}
                    rating={product?.ratings}
                />
            </Box>
        ));
    }




    return (
        <>
            <Slider {...settings}>{productResult}</Slider>;
        </>
    );


};

RelatedProducts.propTypes = {
    id: PropTypes.string
};

export default RelatedProducts;
