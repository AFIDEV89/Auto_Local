import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, Container } from "reactstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box } from "@mui/material";
import { getDataApi } from "@services/ApiCaller";
import { Link } from "react-router-dom";

const CENTER_INDIA = [20.5937, 78.9629]

const RetailFranchise = () => {
    const [storesLocation, setStoresLocation] = useState([]);

    const fetchStoreLocation = async (location) => {
        const result = await getDataApi({ path: 'store/get-list', location });
        if (result?.data?.data) {

            const locations = result.data.data.map(e => ({
                id: e.id,
                name: e.name,
                lat: Number((e.address.latitude || "").replace(",", ".")),
                long: Number((e.address.longitude || "").replace(",", ".")),
                address: e.address?.street_address ?? ""
            })).filter(store => store.lat && store.long);

            setStoresLocation(locations)
        }
    };

    useEffect(() => {
        fetchStoreLocation()
    }, [])

    return (
        <Container>
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Retail Franchise</BreadcrumbItem>
            </Breadcrumb>

            <Box className="mapWrapper">
                <MapContainer center={CENTER_INDIA} zoom={4.5} scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        storesLocation.map(store => {
                            return (
                                <Marker position={[store.lat, store.long]} key={store.id}>
                                    <Popup>
                                        <p className="storeName">{store.name}</p>
                                        <p className="storeAddress">{store.address}</p>
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
            </Box>
        </Container>
    )
}

export default RetailFranchise;