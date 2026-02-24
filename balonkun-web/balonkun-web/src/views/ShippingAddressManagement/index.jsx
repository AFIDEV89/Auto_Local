import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { getDataApi, postDataApi } from "@services/ApiCaller";
import { errorAlert, successAlert } from '@utils';
import SkeletonLoader from "@components/SkeletonLoader";
import { map } from '@assets/images';
import AddressCard from "./AddressCard";
import AddNewAddress from "./AddNewAddress";
import { deleteDataApi, putDataApi } from "../../services/ApiCaller";
import { Container } from "reactstrap";

const ShippingAddressManagement = () => {
    const [addressList, setAddressList] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const fetchAddressess = async () => {
        try {
            setIsLoading(true);
            const addressesData = await getDataApi({
                path: `/user/address`
            });

            if (addressesData?.data?.data) {
                setAddressList([...addressesData.data.data])
            } else {
                setAddressList([])
            }

            setIsLoading(false);
        } catch (e) {
            errorAlert('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    }

    const deleteAddress = async (address) => {
        try {
            const response = await deleteDataApi({
                path: `user/address/${address.id}`
            });

            if(response) {
                successAlert("Address deleted Successfully");
                fetchAddressess()
            }
        } catch (error) {
            errorAlert("Something went wrong. Please try again.")
        }
    }

    const saveEditedAddress = async (address) => {
        try {
            const response = await putDataApi({
                path: `user/address/${address.id}`,
                data: {
                    street_address: address.street_address,
                    city: address.city,
                    state: address.state,
                    postal_code: address.postal_code,
                    country: address.country
                }
            });

            if([200, 201, 204].includes(response?.data.statusCode)) {
                successAlert("Address Updated Successfully");
                fetchAddressess()
            }else {
                errorAlert(response?.data?.errors?.[0])
            }
        } catch (error) {
            errorAlert("Something went wrong. Please try again.")
        }
    }

    const addNewAddressHandler = async (address) => {
        try {
            const response = await postDataApi({
                path: "/user/address",
                data: address
            });

            if([200, 201].includes(response?.data.statusCode)) {
                successAlert("Address added Successfully");
                fetchAddressess()
            }else {
                errorAlert(response?.data?.errors?.[0])
            }

        } catch (error) {
            errorAlert("Something went wrong. Please try again.")
        }
    }

    useEffect(() => {
        fetchAddressess()
    }, [])

    return (
        <Container>
            <Box my={2}>
                <Typography variant="h5" fontWeight={600}>Manage Addresses</Typography>
                <Typography variant="body2" mb={2}>Manage your shipping addresses</Typography>
                <Divider sx={{ bgcolor: '#aaa' }} />
            </Box>

            <AddNewAddress addNewAddressHandler={addNewAddressHandler} />

            {
                isLoading && <SkeletonLoader type="full-width-card" count={5} />
            }

            {
                addressList.length === 0 && !isLoading && (
                    <Box textAlign="center" my={10}>
                        <img src={map} alt="Empty Cart" width="150" />
                        <Typography variant='subtitle1' my={1}>
                            No Addresses found in your account!
                        </Typography>
                        <Typography variant='subtitle1' fontSize={14} my={1}>
                            Add a delivery address.
                        </Typography>
                    </Box>
                )
            }

            <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 4 }}>
                {
                    addressList.map((address, index) => (
                        <Grid item xs={12} key={index}>
                            <AddressCard
                                address={address}
                                saveEditedAddress={saveEditedAddress}
                                deleteAddress={deleteAddress}
                            />
                        </Grid>)
                    )
                }
            </Grid>
        </Container>
    )
}

export default ShippingAddressManagement;