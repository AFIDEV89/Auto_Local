import React, { useEffect } from 'react';
import { Grid, Box, Divider, Typography, TextField, FormControlLabel, Checkbox } from '@mui/material';
import FileUploader from 'ui-component/FileUploader';
import RichTextEditor from 'views/application/e-commerce/ProductDetails/RichTextEditor';
import { findFilterSection } from './helper';
import Parameter from './Parameter';

const ParameterForm = ({
    filtersData = [],
    formValue,
    setFormValue,
    handleChange
}) => {
    useEffect(() => {
        if (!!(filtersData?.length)) {
            let isChanged = false;
            const temp = Object.assign({}, formValue);

            // vehicle brand filtering
            if (temp.vehicleBrand) {
                const vehicleBrand = filtersData.find((item) => item.title === "Vehicle Brands");

                if (vehicleBrand) {
                    const brand = vehicleBrand.list.find((brand) => brand.dbId === temp.vehicleBrand);

                    temp.vehicleBrand = formValue.vehicleType === brand.vehicle_type_id ? temp.vehicleBrand : null
                    isChanged = true;
                }
            }

            // vehicle model filtering
            if (temp.vehicleModel && !temp.vehicleBrand) {
                const vehicleModel = filtersData.find((item) => item.title === "Vehicle Models");

                if (vehicleModel) {
                    const model = vehicleModel.list.find((model) => model.dbId === temp.vehicleModel);

                    temp.vehicleModel = formValue.vehicleType === model.vehicle_type_id ? temp.vehicleMode : null;

                    isChanged = true;
                }
            }
            if (isChanged) {
                setFormValue(temp);
            }
        }
    }, [formValue.vehicleType]);

    useEffect(() => {
        if (!!(filtersData?.length)) {
            const temp = Object.assign({}, formValue);

            if (temp.vehicleModel) {
                const vehicleModel = filtersData.find((item) => item.title === "Vehicle Models");

                if (vehicleModel) {
                    const model = vehicleModel.list.find((model) => model.dbId === temp.vehicleModel);

                    temp.vehicleModel = formValue.vehicleBrand === model.brand_id ? temp.vehicleModel : null
                    setFormValue(temp);
                }
            }
        }
    }, [formValue.vehicleBrand]);

    useEffect(() => {
        if (!!(filtersData?.length)) {
            let isChanged = false;
            const temp = Object.assign({}, formValue);

            // product subcategory filtering
            if (temp.productSubCategory && !temp.productCategory) {
                const productSubCategory = filtersData.find((item) => item.title === "Product Subcategories");

                if (productSubCategory) {
                    const subCategory = productSubCategory.list.find((subCategory) => subCategory.dbId === temp.productSubCategory);

                    temp.productSubCategory = formValue.productCategory === subCategory.category_id ? temp.productSubCategory : null;
                    isChanged = true;
                }
            }

            if (isChanged) {
                setFormValue(temp);
            }
        }
    }, [formValue.productCategory]);

    const handleCheckboxToggle = (event) => {
        handleChange(event.target.checked, "showInFooter")

        if(!event.target.checked) {
            handleChange(null, "seoTitle")
            handleChange(null, "urlText")
        }
    }
    return (
        <Box>
            <Typography variant={"h5"} mt={1} mb={1}>Select Page Filters</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Parameter
                        id="productCategory"
                        required
                        value={formValue.productCategory}
                        key={formValue.productCategory}
                        handleChange={handleChange}
                        filterData={findFilterSection(filtersData, "Product Categories", formValue)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Parameter
                        id="productSubCategory"
                        value={formValue.productSubCategory}
                        key={formValue.productSubCategory}
                        handleChange={handleChange}
                        filterData={findFilterSection(filtersData, "Product Subcategories", formValue)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Parameter
                        id="vehicleType"
                        value={formValue.vehicleType}
                        key={formValue.vehicleType}
                        handleChange={handleChange}
                        filterData={findFilterSection(filtersData, "Vehicle Types", formValue)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Parameter
                        id="vehicleBrand"
                        key={formValue.vehicleBrand}
                        value={formValue.vehicleBrand}
                        handleChange={handleChange}
                        filterData={findFilterSection(filtersData, "Vehicle Brands", formValue)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Parameter
                        id="vehicleModel"
                        value={formValue.vehicleModel}
                        key={formValue.vehicleModel}
                        handleChange={handleChange}
                        filterData={findFilterSection(filtersData, "Vehicle Models", formValue)}
                    />
                </Grid>
            </Grid>

            <Divider sx={{
                margin: "24px 0"
            }} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Canonical URL"
                        required
                        value={formValue.canonicalUrl}
                        onChange={(e) => handleChange(e.target.value, "canonicalUrl")}
                    />
                </Grid>
            </Grid>

            <Divider sx={{
                margin: "24px 0"
            }} />

            <Typography variant="subtitle1" mb={2}>Header</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FileUploader
                        uploadFile={(fileLocation) => handleChange(fileLocation, "file")}
                        picUrl={formValue.file}
                    />
                </Grid>

                <Grid item xs={12}>
                    <span className="richTitle">Content*</span>
                    <RichTextEditor
                        productInfo={formValue.seoText}
                        name="description"
                        onChangeEditor={(e, setData) => handleChange(setData, "seoText")}
                    />
                </Grid>
            </Grid>

            <Divider sx={{
                margin: "24px 0"
            }} />

            <Typography variant="subtitle1" mb={2}>Page</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Page Title"
                        value={formValue.seoPageTitle}
                        onChange={(e) => handleChange(e.target.value, "seoPageTitle")}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Page Description"
                        multiline
                        rows={5}
                        value={formValue.seoPageDescription}
                        onChange={(e) => handleChange(e.target.value, "seoPageDescription")}
                    />
                </Grid>
            </Grid>

            <FormControlLabel
                control={<Checkbox 
                    checked={formValue.showInFooter} 
                    onChange={handleCheckboxToggle} 
                />}
                label="Show in Footer"
                sx={{
                    marginTop: 2
                }}
            />

            {
                formValue.showInFooter && (
                    <>
                        <Divider sx={{
                            margin: "24px 0"
                        }} />

                        <Typography variant="subtitle1" mb={2}>Footer</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Footer Title"
                                    required
                                    helperText="Group name under which this URL will be categorised"
                                    value={formValue.seoTitle}
                                    onChange={(e) => handleChange(e.target.value, "seoTitle")}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="URL Text"
                                    required
                                    value={formValue.urlText}
                                    onChange={(e) => handleChange(e.target.value, "urlText")}
                                />
                            </Grid>
                        </Grid>
                    </>
                )
            }


        </Box>
    )
}

export default ParameterForm;