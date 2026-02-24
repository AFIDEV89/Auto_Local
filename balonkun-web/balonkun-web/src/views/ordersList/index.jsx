import { Box, Button, Divider, Typography, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getDataApi } from "@services/ApiCaller";
import OrderCard from "./OrderCard";
import { emptyCart } from '@assets/images';
import { useNavigate } from 'react-router-dom';
import { errorAlert } from '@utils';
import SkeletonLoader from "@components/SkeletonLoader";

const OrdersList = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrdersList = async () => {
        try {
            setIsLoading(true);
            const orders = await getDataApi({ path: `order/user` });

            if (orders?.data?.data) {
                setOrdersList([...orders.data.data])
            } else {
                setOrdersList([])
            }
            setIsLoading(false);
        } catch (error) {
            errorAlert('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrdersList();
    }, [])

    return (
        <Container>
            <Box my={2}>
                <Typography variant="h5" fontWeight={600}>Order History</Typography>
                <Typography variant="body2" mb={2}>Manage your recent orders</Typography>
                <Divider sx={{ bgcolor: '#aaa' }} />
            </Box>

            {
                isLoading && <SkeletonLoader type="full-width-card" count={5} />
            }

            {
                ordersList.length === 0 && !isLoading && (
                    <Box textAlign="center" my={10}>
                        <img src={emptyCart} alt="Empty Cart" width="200" />
                        <Typography variant='subtitle1' my={2}>
                            There are no order history yet. Start purchase some products...
                        </Typography>

                        <Button variant='outlined' onClick={() => navigate("/")}>Browse products</Button>
                    </Box>
                )
            }

            {
                ordersList.map((order) => <OrderCard order={order} key={order.id} />)
            }
        </Container>
    )
}

export default OrdersList;