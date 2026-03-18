import React from "react";
import { Box, Button, CardMedia, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "@redux/actions";
import { ROUTES } from "@shared/constants";

const OrderItem = ({
    product
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCart = () => {
        dispatch(actions.cartProductCreate(product.product_id, () => { }));
    }

    const openProduct = () => {
        navigate(`${ROUTES.PRODUCT}/${product.product_id}`);
    }

    return (
        <Box display="flex" my={2}>
            {product?.product?.pictures?.[0] && <CardMedia
                component="img"
                loading="lazy"
                image={product.product.pictures[0]}
                alt="product"
                sx={{ width: 90, borderRadius: 0.5, marginRight: 2 }}
            />}

            <Box>
                <Typography mb={2} fontSize={14} variant="subtitle2">{product?.product?.name}</Typography>

                <Box display="flex">
                    <Button variant="contained" onClick={addToCart} sx={{ marginRight: 2 }} size="small">
                        Reorder
                    </Button>
                    <Button size="small" onClick={openProduct}>
                        View item
                    </Button>
                </Box>
            </Box>
        </Box>)
}

export default OrderItem;