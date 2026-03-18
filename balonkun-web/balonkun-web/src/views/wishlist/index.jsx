import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import SkeletonLoader from "@components/SkeletonLoader";
import { emptyCart } from '@assets/images';
import { errorAlert, successAlert } from '@utils';
import WishListItem from "./wishListItem";
import { getDataApi, putDataApi } from "@services/ApiCaller";
import { useDispatch } from "react-redux";
import * as actions from "@redux/actions";
import { Container } from "reactstrap";

const WishListPage = () => {
    const [wishList, setWishList] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchWishList = async () => {
        try {
            setIsLoading(true);
            const wishlistData = await getDataApi({
                path: "user/wishlist"
            })

            if (wishlistData?.data?.data) {
                setWishList([...wishlistData.data.data])
            } else {
                setWishList([])
            }

            setIsLoading(false);

        } catch (e) {
            errorAlert('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    }
    
    const moveItemToCart = (product_id) => {
        dispatch(actions.cartProductCreate(product_id, () => { }));
        toogleWishListItem(product_id);
    }

    const toogleWishListItem = async (product_id) => {
        try {
            setIsLoading(true);
            const response = await putDataApi({
                path: `user/wishlist/${product_id}`
            })

            if(response?.data?.data && [204].includes(response?.data?.statusCode)) {
                successAlert("Product removed from wishlist");
                fetchWishList()
            }

            setIsLoading(false);
        } catch (e) {
            errorAlert('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchWishList()
    }, [])

    return (
        <Container>
            <Box my={2}>
                <Typography variant="h5" fontWeight={600}>
                    My Wishlist { wishList.length ? `(${wishList.length})` : "" }
                </Typography>
                <Typography variant="body2" mb={2}>Save and Discover Must-Have Items</Typography>
                <Divider sx={{ bgcolor: '#aaa' }} />
            </Box>

            {
                isLoading && <SkeletonLoader type="full-width-card" count={5} />
            }

            {
                wishList.length === 0 && !isLoading && (
                    <Box textAlign="center" my={10}>
                        <img src={emptyCart} alt="Empty Cart" width="150" />
                        <Typography variant='subtitle1' my={1}>
                            Empty Wishlist
                        </Typography>
                        <Typography variant='subtitle1' fontSize={14} my={1}>
                            You have no items in your wishlist. Start adding!
                        </Typography>
                    </Box>
                )
            }

            <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 4 }}>
                {
                    wishList.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.id} style={{display: 'flex'}}>
                            <WishListItem product={item.product} addToCart={moveItemToCart} removeProduct={toogleWishListItem} />
                        </Grid>)
                    )
                }
            </Grid>
        </Container>
    )
}

export default WishListPage;