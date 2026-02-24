import { Box, Button, Card, CardActions, CardContent, Collapse, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { CardHeader } from "reactstrap";
import OrderItem from "./OrderItem";
import { dateFormatter } from "@utils/date";

const OrderStatusMap = {
    failed: {
        text: "Failed",
        subText: "Your order has failed",
        color: "#ff6161",
        hole: false
    },
    completed: {
        text: "Delivered",
        subText: "Your order has been delivered",
        color: "#26a541",
        hole: false
    },
    pending: {
        text: "Pending",
        color: "#ff9f00",
        hole: false
    },
    processing: {
        text: "Processing",
        subText: "Your order is under process",
        color: "#ff9f00",
        hole: false
    },
    cancelled: {
        text: "Cancelled",
        subText: "Your order has been cancelled",
        color: "#ff6161",
        hole: false
    },
    new_order: {
        text: "Arriving",
        subText: "Your order has been placed",
        color: "#26a541",
        hole: true
    }
}

const OrderCard = ({
    order
}) => {
    const [expanded, setExpanded] = useState(false);
    const orderStatus = OrderStatusMap[order.status]

    return (
        <Card variant="outlined" sx={{ marginTop: 1, marginBottom: 1 }}>
            <CardHeader >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box display="flex" gap={4}>
                        <Box>
                            <Typography variant="subtitle2" fontSize={12}>ORDER PLACED</Typography>
                            <Typography variant="subtitle2" fontSize={12}>{dateFormatter(order.createdAt)}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontSize={12}>TOTAL</Typography>
                            <Typography variant="subtitle2" fontSize={12}>₹{order.total_amount}</Typography>
                        </Box>
                    </Box>


                    <Typography variant="subtitle2" fontSize={12}>Order# {order.id}</Typography>
                </Box>

            </CardHeader>
            <CardContent>
                <Box display="flex" alignItems="center">
                    <Box sx={{
                        height: 8,
                        width: 8,
                        background: !orderStatus.hole ? orderStatus.color : "#fff",
                        marginRight: 1,
                        borderRadius: "50%",
                        display: "inline-block",
                        border: `2px solid ${orderStatus.color}`
                    }} />
                    <Typography variant="body2" fontWeight="600" fontSize={13}>{orderStatus.text}</Typography>
                </Box>

                {orderStatus.subText && <Typography variant="subtitle2" fontSize={11}>{orderStatus.subText}</Typography>}

                {
                    order.order_products.map(product => (
                        <OrderItem
                            product={product}
                            key={`product_${order.id}_${product.product_id}`}
                        />
                    ))
                }
            </CardContent>
            <CardActions disableSpacing>
                <Button onClick={() => setExpanded(prev => !prev)} size="small">View Order Details</Button>
            </CardActions>

            <Collapse in={expanded} timeout="auto">
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item lg={4}>
                            <Typography variant="subtitle2" mb={1}>Store Address</Typography>
                            <Typography fontSize={12}>{order.store.name}</Typography>
                            <Typography fontSize={12}>{order.store.address.street_address}</Typography>
                            <Typography fontSize={12}>{order.store.address.country}</Typography>
                        </Grid>
                        <Grid item lg={4}>
                            <Typography variant="subtitle2" mb={1}>Payment method</Typography>
                            <Typography variant="subtitle1" fontSize={12}>{order.payment_type}</Typography>
                        </Grid>
                        <Grid item lg={4}>
                            <Typography variant="subtitle2" mb={1}>Order Summary</Typography>

                            <Grid container columnSpacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        Item(s) Subtotal:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        ₹{order.total_amount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        Shipping:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        ₹0
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        Total:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12}>
                                        ₹{order.total_amount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12} fontWeight="bold">
                                        Grand Total:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontSize={12} fontWeight="bold">
                                        ₹{order.total_amount}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default OrderCard;