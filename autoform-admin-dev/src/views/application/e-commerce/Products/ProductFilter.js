import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
    Button,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Rating,
    Skeleton,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// project imports
import Colors from './Colors';
import MainCard from 'ui-component/cards/MainCard';
import Accordion from 'ui-component/extended/Accordion';
import { gridSpacing } from 'store/constant';

const VehicleTypes = ({ vehicles = [], selectedVehicles = [], handelFilter }) => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={42} />
            ) : (
                <>
                    {vehicles.map((item) => (
                        <FormControlLabel
                            key={item.id}
                            control={<Checkbox checked={selectedVehicles.some((id) => id === item.id)} />}
                            onChange={() => handelFilter('vehicles', item.id)}
                            label={item.name}
                        />
                    ))}
                </>
            )}
        </Stack>
    );
};

VehicleTypes.propTypes = {
    vehicles: PropTypes.array,
    selectedVehicles: PropTypes.array,
    handelFilter: PropTypes.func
};

// ==============================|| PRODUCT GRID - CATEGORIES FILTER ||============================== //

const Categories = ({ categories = [], selectedCategories = [], handelFilter }) => {
    const [isCategoriesLoading, setCategoriesLoading] = useState(true);
    useEffect(() => {
        setCategoriesLoading(false);
    }, []);

    return (
        <Grid container spacing={1}>
            {isCategoriesLoading ? (
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" width="100%" height={96} />
                </Grid>
            ) : (
                <>
                    {categories.map((item) => (
                        <Grid item xs={12} sm={6} key={item.id}>
                            <FormControlLabel
                                control={<Checkbox checked={selectedCategories.some((id) => id === item.id)} />}
                                onChange={() => handelFilter('product_categories', item.id)}
                                label={item.name}
                            />
                        </Grid>
                    ))}
                </>
            )}
        </Grid>
    );
};

Categories.propTypes = {
    categories: PropTypes.array,
    selectedCategories: PropTypes.array,
    handelFilter: PropTypes.func
};

// ==============================|| PRODUCT GRID - PRICE FILTER ||============================== //

const Price = ({ price, handelFilter }) => {
    const [isPriceLoading, setPriceLoading] = useState(true);
    useEffect(() => {
        setPriceLoading(false);
    }, []);

    return (
        <>
            {isPriceLoading ? (
                <Skeleton variant="rectangular" width="100%" height={172} />
            ) : (
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        aria-label="layout"
                        value={price}
                        onChange={(e) => handelFilter('price', e.target.value)}
                        name="row-radio-buttons-group"
                    >
                        <Grid container spacing={0.25}>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="0-1000"
                                    control={<Radio />}
                                    label="Below ₹1,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="1000-5000"
                                    control={<Radio />}
                                    label="₹1,000 - ₹5,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="5000-10000"
                                    control={<Radio />}
                                    label="₹5,000 - ₹10,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="10000-15000"
                                    control={<Radio />}
                                    label="₹10,000 - ₹15,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="15000-20000"
                                    control={<Radio />}
                                    label="₹15,000 - ₹20,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    value="20000-999999"
                                    control={<Radio />}
                                    label="Over ₹20,000"
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: 28 },
                                        '& .MuiFormControlLabel-label': { color: 'grey.900' }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </FormControl>
            )}
        </>
    );
};

Price.propTypes = {
    price: PropTypes.string,
    handelFilter: PropTypes.func
};

// ==============================|| PRODUCT GRID - RATING FILTER ||============================== //

const RatingSection = ({ rating, handelFilter }) => {
    const [isRatingLoading, setRatingLoading] = useState(true);
    useEffect(() => {
        setRatingLoading(false);
    }, []);

    return (
        <>
            {isRatingLoading ? (
                <Skeleton variant="rectangular" width="100%" height={172} />
            ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Rating
                        precision={0.5}
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => handelFilter('rating', '', newValue)}
                    />
                    <Typography component="legend">({rating})</Typography>
                </Stack>
            )}
        </>
    );
};

RatingSection.propTypes = {
    rating: PropTypes.number,
    handelFilter: PropTypes.func
};

// ==============================|| PRODUCT GRID - FILTER ||============================== //

const ProductFilter = ({ filter = {}, handelFilter, categories = [], vehicles = [], colorOptions = [] }) => {
    const matchDownLG = useMediaQuery((theme) => theme.breakpoints.down('xl'));

    const filterData = [
        {
            id: 'vehicles',
            defaultExpand: true,
            title: 'Vehicle Types',
            content: <VehicleTypes vehicles={vehicles} selectedVehicles={filter.vehicles || []} handelFilter={handelFilter} />
        },
        {
            id: 'product_categories',
            defaultExpand: true,
            title: 'Categories',
            content: <Categories categories={categories} selectedCategories={filter.product_categories || []} handelFilter={handelFilter} />
        },
        {
            id: 'colors',
            defaultExpand: true,
            title: 'Colors',
            content: <Colors colors={filter.colors} colorOptions={colorOptions} handelFilter={handelFilter} />
        },
        {
            id: 'price',
            defaultExpand: true,
            title: 'Price',
            content: <Price price={filter.price} handelFilter={handelFilter} />
        },
        {
            id: 'rating',
            defaultExpand: true,
            title: 'Rating',
            content: <RatingSection rating={filter.rating} handelFilter={handelFilter} />
        }
    ];

    return (
        <MainCard border={!matchDownLG} content={false} sx={{ overflow: 'visible' }}>
            <CardContent sx={{ p: 1, height: matchDownLG ? '100vh' : 'auto' }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Accordion data={filterData} />
                    </Grid>
                    <Grid item xs={12} sx={{ m: 1 }}>
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <Button variant="contained" fullWidth color="error" onClick={() => handelFilter('reset', '')}>
                                Clear All
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

ProductFilter.propTypes = {
    filter: PropTypes.object,
    handelFilter: PropTypes.func,
    categories: PropTypes.array,
    vehicles: PropTypes.array,
    colorOptions: PropTypes.array
};

export default ProductFilter;
