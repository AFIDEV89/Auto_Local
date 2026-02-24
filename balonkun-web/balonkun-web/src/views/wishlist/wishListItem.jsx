import { Box, Button, Card, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import React from "react";
import { getProductPrice } from "../../utils/product";
import { Link } from "react-router-dom";
import { ROUTES } from "@shared/constants";

const WishListItem = ({
    product,
    removeProduct,
    addToCart
}) => {
    return (
        <Card variant="outlined" sx={{width: '100%', display: "flex", flexDirection: "column", justifyContent: "space-between"}}>

            <CardContent sx={{ display: "flex" }}>
                {product?.pictures?.[0] && (
                    <Link to={`${ROUTES.PRODUCT}/${product.id}`}>
                        <CardMedia
                            component="img"
                            loading="lazy"
                            image={product.pictures[0]}
                            alt="product"
                            sx={{ width: 90, borderRadius: 0.5, marginRight: 2 }}
                        />
                    </Link>
                )}
                <Box>
                    <Link to={`${ROUTES.PRODUCT}/${product.id}`}>
                        <Typography fontSize={14} variant="subtitle2" style={{ color: "#000" }}>{product.name}</Typography>
                    </Link>
                    <Rating name="disabled" value={product.ratings || 0} readOnly size="small" />
                    <Typography fontSize={12} variant="subtitle2">&#8377;{getProductPrice(product)}</Typography>
                </Box>
            </CardContent>

            <CardActions>
                <Button variant="contained" size="small" sx={{width: "100%", borderRadius: 5 }} onClick={() => addToCart(product.id)}>
                    Add to Cart
                </Button>
                <Button variant="outlined" size="small" sx={{width: "100%", borderRadius: 5}} onClick={() => removeProduct(product.id)}>
                    Remove
                </Button>
            </CardActions>

        </Card>
    )
}

export default WishListItem