import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";
import { getProductPicture, formatNumberToIndian } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { OPERATION_TYPE } from "@shared/constants";

const ShippingProductCard = ({
    itemIndex,
    cartItem,
    onHandleItemCount,
    onHandleCartProductDelete
}) => {
    const picture = getProductPicture(cartItem.product);


    return (
        <Card variant="outlined" sx={{ marginTop: 1, marginBottom: 1 }}>
            <CardContent>
                <Box display="flex">
                    {picture && <CardMedia
                        component="img"
                        loading="lazy"
                        image={picture}
                        alt="product"
                        sx={{ width: 90, borderRadius: 0.5, marginRight: 2 }}
                    />}

                    <Box>
                        <Typography mb={2} fontSize={14} variant="subtitle2">{cartItem.product.name}</Typography>
                        <Typography mb={2} fontSize={14} variant="subtitle1">
                            &#8377; {formatNumberToIndian((cartItem.product.discounted_price || cartItem.product.original_price) * cartItem.quantity)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            <CardActions>
                <Box display="flex">
                    <div className="plus-minus">
                        <IconButton
                            onClick={() =>
                                onHandleItemCount(
                                    cartItem.product_id,
                                    OPERATION_TYPE.DECREMENT,
                                    itemIndex
                                )
                            }
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </IconButton>

                        <p className="value text">
                            {cartItem.quantity}
                        </p>

                        <IconButton onClick={() =>
                            onHandleItemCount(
                                cartItem.product_id,
                                OPERATION_TYPE.INCREMENT,
                                itemIndex
                            )
                        }>
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>

                    </div>
                    <Button size="small" onClick={() => onHandleCartProductDelete(cartItem.product_id, itemIndex)}>
                        Remove
                    </Button>
                </Box>
            </CardActions>
        </Card>
    )
}

export default ShippingProductCard;