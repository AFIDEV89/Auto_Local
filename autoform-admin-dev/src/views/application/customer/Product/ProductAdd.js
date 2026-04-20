import React, { forwardRef, useCallback, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button, Checkbox, Chip, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Divider, FormControlLabel, Grid, IconButton, Input,
  InputAdornment,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography
} from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import RichTextEditor from "views/application/e-commerce/ProductDetails/RichTextEditor";
import API from "api/axios";
import { apiErrorHandler, errorAlert, successAlert } from "../../../helpers";
import ImageUploader from "./ImageInput";
import RequiredFieldTag from './RequiredFieldTag';
import VideoUploader from "./VideoInput";
import useFetchProductMetaData from "./useFetchProductMetaData";

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const ITEM_HEIGHT = 48;

const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  chip: {
    margin: 2,
  },
};

const tagNames = ["Cars", "Black Covers", "Leather Cover", "Accesories"];
const availabilty = [{ label: "Yes", value: 'yes' }, { label: "No", value: "no" }];

const ProductAdd = ({
  getProductDetail,
  open,
  handleCloseDialog,
  productInfo = {},
  setCategoryList,
  setVehicles,
  setColorList
}) => {
  const [brandList, setBrandList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [productName, setProductName] = useState(productInfo.name || "");
  const [productDescription, setProductDescription] = useState(productInfo.description || "");
  const [productDetail, setProductDetail] = useState(productInfo.detail || "");
  const [additionalInfo, setAdditionalInfo] = useState(productInfo.additional_info || "");
  const [variantCount, setVariantCount] = useState(productInfo?.product_variants && productInfo?.product_variants.length > 1
    ? productInfo?.product_variants.length
    : 1
  );
  const [variant, setVariant] = useState({});
  const [category, setCategory] = useState(productInfo.category?.id || null);
  const [subCategory, setSubCategory] = useState(productInfo.subcategory_id || null);
  const [vehicleType, setVehicleType] = useState(productInfo.vehicle_detail?.vehicle_type_id || null);
  const [vehicleCategory, setVehicleCategory] = useState(productInfo.vehicle_detail?.vehicle_category_id || "");
  const [brand, setBrand] = useState(productInfo.vehicle_detail?.brand_id || "");
  const [model, setModel] = useState(productInfo.vehicle_detail?.model_id || "");
  const [modelVariant, setModelVariant] = useState(productInfo.vehicle_detail?.model_variant || "");

  const [ratings, setRatings] = useState(productInfo.ratings || null);
  const [productCode, setProductCode] = useState(productInfo.product_code || null);
  const [quantity, setQuantity] = useState(productInfo.quantity || 0);

  const [orignalPrice, setOrignailPrice] = useState(productInfo.original_price || null);
  const [tags, setTags] = useState(productInfo.tags || []);
  const [suggestions, setSuggestions] = useState(productInfo.suggestions || []);
  const [isAvailabilty, setAvailability] = useState(productInfo.availability || null);
  const [images, setImages] = useState(productInfo.pictures || []);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState(productInfo.videos || []);
  const [section, setSection] = useState({
    trending: productInfo.is_trending || false,
    latest: productInfo.is_latest || false,
  });
  const [seoPageTitle, setSeoPageTitle] = useState(productInfo.seo_title || "");
  const [seoPageDescription, setSeoPageDescription] = useState(productInfo.seo_description || "");
  const [canonicalUrl, setCanonicalUrl] = useState(productInfo.seo_canonical || "");

  const [payloadData, setPayloadData] = useState({});

  const { designList, vehicleCategoryList, materialList, colorList, vehicleList, categoryList, SubCategoryList, vehicles } = useFetchProductMetaData();

  const variantCountArray = Array.from(Array(variantCount).keys());

  useEffect(() => {
    setCategoryList?.(categoryList);
    setVehicles?.(vehicles);
    setColorList?.(colorList);
  }, [categoryList, vehicles, colorList]);

  const handleFetchModelList = useCallback(() => {
    if (brand && vehicleType) {
      API.get("brand-model/get-list", { params: { brand_id: brand, vehicle_type_id: vehicleType } })
        .then((res) => {
          if (res?.data?.data) {
            setModelList(res.data.data);
          }
        });
    }
  }, [brand, vehicleType]);

  const handleFetchSubCategoryList = useCallback(() => {
    if (category) {
      API.get(`subcategory/category/${category}`).then((res) => {
        if (res?.data?.data) {
          setSubCategoryList(res.data.data);
        }
      });
    }
  }, [category]);

  const handleFetchBrandList = useCallback(() => {
    const params = {
      ...(vehicleType && { vehicle_type_id: vehicleType })
    };

    API.get("brand/get-list", { params })
      .then((res) => {
        if (res?.data?.data) {
          setBrandList(res.data.data);
        }
      });
  }, [vehicleType]);

  const clearState = () => {
    setProductName("");
    setProductDescription("");
    setProductDetail("");
    setAdditionalInfo("");
    setVariantCount(1);
    setVariant({});
    setCategory("");
    setSubCategory("");
    setVehicleType(null);
    setRatings("");
    setProductCode(null);
    setQuantity(0);
    setBrand(null);
    setModel(null);
    setModelVariant(null);
    setVehicleCategory(null);
    setOrignailPrice(null);
    setTags([]);
    setSuggestions([]);
    setAvailability(null);
    setImages([]);
    setVideos([]);
    setSection({
      trending: false,
      latest: false,
    });
  };

  const handleCheckVariant = () => {
    const varArray = Object.values(variant);

    const designArr = varArray && varArray.length > 0 ? Array.from(new Set(varArray.map(({ design_id }) => design_id))) : [];
    const materialArr = varArray && varArray.length > 0 ? Array.from(new Set(varArray.map(({ material_id }) => material_id))) : [];
    const majorColorArr = varArray && varArray.length > 0 ? Array.from(new Set(varArray.map(({ major_color_id }) => major_color_id))) : [];

    if ((designArr && designArr.length === varArray.length) && (materialArr && materialArr.length === varArray.length) && (majorColorArr && majorColorArr.length === varArray.length)) {
      return true;
    }
    else return false;
  };

  const handleCreateProduct = async () => {
    const checkVariant = handleCheckVariant();

    if (!checkVariant) {
      errorAlert("Please enter Variant with diffrent design, material and major Colors");
      return;
    }

    try {
      setLoading(true);
      const variants = [...Object.values(variant)];

      const payload = {
        category_id: category,
        subcategory_id: subCategory,
        name: productName.trim(),
        pictures: images?.length ? images : null,
        original_price: parseFloat(orignalPrice),
        description: productDescription,
        product_code: productCode,
        availability: isAvailabilty ? isAvailabilty.toLowerCase() : "",
        quantity,
        reviews: {},
        suggestions,
        is_trending: section.trending || false,
        is_latest: section.latest || false,
        additional_info: additionalInfo,
        seo_title: seoPageTitle || null,
        seo_description: seoPageDescription || null,
        seo_canonical: canonicalUrl || null,
        vehicle_detail: {
          vehicle_type_id: vehicleType,
          brand_id: brand || null,
          model_id: model || null,
          ...(modelVariant && { model_variant: modelVariant }),
          ...(vehicleCategory && { vehicle_category_id: vehicleCategory })
        },
        ...(!!productDetail && { detail: productDetail }),
        ...(!!ratings && { ratings: parseFloat(ratings) }),
        ...(!!videos?.length && { videos: videos }),
        ...(!!tags?.length && { tags: tags }),
        ...(!!(variants?.length) && {
          variants: variants.map(vr => ({
            design_id: vr.design_id,
            major_color_id: vr.major_color_id,
            material_id: vr.material_id,
            ...(!!(vr?.id) && {
              id: vr.id
            }),
            ...(!!(vr.minor_color_ids?.length) && {
              minor_color_ids: vr.minor_color_ids
            })
          })
          )
        })
      };

      if (productInfo.id) {
        const request = {
          ...payload,
        };
        delete request.sections;
        const response = await API.put(`/product/update/${productInfo.id}`, request);

        if (productInfo.id && response.data.statusCode === 204) {
          setTimeout(() => {
            clearState();
            successAlert(`Product updated successfully.`);
            handleCloseDialog();
            getProductDetail();
          }, 0);
        }
        else {
          errorAlert(response.data.message);
        }
      }
      else {
        const response = await API.post("/product/create", payload);

        if (response && response.data && response.data.data) {
          setTimeout(() => {
            clearState();
            successAlert(`Product added successfully.`);
            handleCloseDialog();
          }, 0);
        }
        else {
          errorAlert(response.data.message);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      apiErrorHandler(error, `Something went wrong while ${productInfo.id ? "updating" : "adding"} the Product`);
    }
  };

  const handleImages = (data) => {
    setImages(data);

    if (productInfo.id) {
      onChangeFormData("", "", data);
    }
  };

  const handleVideos = (data) => {
    setVideos(data);

    if (productInfo.id) {
      onChangeFormData("", "", "", data);
    }
  };

  const onChangeFormData = (e, setData, isImage = false, isVideo = false) => {
    let data = { ...payloadData };

    if (isImage) {
      data["pictures"] = isImage;
      setPayloadData(data);
      return;
    }
    else if (isVideo) {
      data["videos"] = isVideo;
      setPayloadData(data);
      return;
    }
    else {
      if (productInfo.id) {
        if (e === "description") {
          setProductDescription(setData);
          setPayloadData({ description: setData });
        }
        else if (e === "additional_info") {
          setAdditionalInfo(setData);
          setPayloadData({ ...payloadData, additional_info: setData });
        }
        else {
          const { value, name } = e?.target;
          let data = { ...payloadData };

          if (name === "ratings") {
            data[name] = parseFloat(value);
          }
          else if (name === "latest" || name === "trending") {
            const sectionData = { ...section };
            sectionData[name] = e.target.checked;
            setData(sectionData);
            data["sections"] = sectionData;
            setPayloadData(data);
            return;
          }
          else {
            data[name] = value;
          }

          setData(value);
          setPayloadData(data);
        }
      }
      else {
        if (e === "description") {
          setProductDescription(setData);
        } else if (e === "additional_info") {
          setAdditionalInfo(setData);
        } else {
          const { value, name } = e?.target;
          if (name === "latest" || name === "trending") {
            const sectionData = { ...section };
            sectionData[name] = e.target.checked;
            setData(sectionData);
            return;
          } else {
            setData(value);
          }
        }
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event?.key === "-" || event?.key === "+") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    handleFetchModelList();
  }, [brand, vehicleType]);

  useEffect(() => {
    handleFetchBrandList();
  }, [vehicleType]);

  useEffect(() => {
    handleFetchSubCategoryList();
  }, [category]);

  useEffect(() => {
    if (productInfo && productInfo?.product_variants && productInfo?.product_variants.length > 0) {
      let varObj = {};

      productInfo?.product_variants.forEach((p, index) => {
        const minorColor = [];

        if (p && p?.product_variant_minor_colors && p?.product_variant_minor_colors.length > 0) {
          p?.product_variant_minor_colors.map(c => minorColor.push(c.minor_color_id));
        }

        varObj = {
          ...varObj,
          [`${index}`]: {
            id: p.id,
            design_id: p.design_id,
            material_id: p.material_id,
            major_color_id: p.color && Object.keys(p.color).length > 0 ? p.color.id : "",
            minor_color_ids: minorColor || [],
          }
        };
      });

      setVariant(varObj);
    }

  }, [productInfo]);

  // useEffect(() => {
  //   if (!!(Object.keys(variant)?.length) && variant[0]?.design_id) {

  //     const params = {
  //       design_id: variant[0].design_id,
  //       ...(vehicleCategory && { vehicle_category_id: vehicleCategory }),
  //       ...(brand && { brand_id: brand })
  //     };

  //     API.get("/product/price", { params })
  //       .then(result => {
  //         if (result?.data?.statusCode === 200) {
  //           setOrignailPrice(result.data.data || 0);
  //         }
  //       });
  //   }
  // }, [variant, vehicleCategory, brand]);

  const isVehicleDetailsRequired = category === 1 || category === 3;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      disableEnforceFocus
      sx={{
        "&>div:nth-of-type(3)": {
          justifyContent: "flex-end",
          "&>div": {
            m: 0,
            borderRadius: "0px",
            maxWidth: 550,
            maxHeight: "100%",
          },
        },
      }}
    >
      <DialogTitle>
        {productInfo.id ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic1"
              fullWidth
              size="small"
              label="Product Name"
              name="name"
              value={productName}
              onChange={(event) => onChangeFormData(event, setProductName)}
            />
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <span className="richTitle">Product Description</span>
            <RichTextEditor
              productInfo={productDescription}
              name="description"
              onChangeEditor={onChangeFormData}
            />
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <span className="richTitle">Additional Info</span>
            <RichTextEditor
              productInfo={additionalInfo}
              name="additional_info"
              onChangeEditor={onChangeFormData}
            />
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic2"
              fullWidth
              size="small"
              multiline
              rows={2}
              name="detail"
              value={productDetail}
              label="Product Detail"
              onChange={(event) => onChangeFormData(event, setProductDetail)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              size="small"
              value={category}
              name="category_id"
              label="Product Category"
              fullWidth
              onChange={(event) => onChangeFormData(event, setCategory)}
            >
              {categoryList &&
                categoryList.length > 0 &&
                categoryList.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={category && category === option.id ? true : false}
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              size="small"
              value={subCategory}
              name="subcategory_id"
              label="Product SubCategory"
              fullWidth
              onChange={(event) => onChangeFormData(event, setSubCategory)}
            >
              {subCategoryList && subCategoryList.length > 0 ? (
                subCategoryList.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={
                      subCategory && subCategory === option.id ? true : false
                    }
                  >
                    {option.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  No subcategories available for the selected category
                </MenuItem>
              )}
            </TextField>
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              size="small"
              label="Vehicles Type"
              name="vehicle_type"
              value={vehicleType}
              fullWidth
              onChange={(event) => {
                setBrand(null);
                setModel(null);
                setModelVariant(null);
                setVehicleCategory(null);
                setModelList([]);
                onChangeFormData(event, setVehicleType);
              }}
            >
              {vehicles &&
                vehicles.length > 0 &&
                vehicles.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={
                      vehicleType && vehicleType === option.id ? true : false
                    }
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="number"
              id="outlined-basic2"
              size="small"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                min: 0,
                max: 5,
                step: 0.1,
              }}
              fullWidth
              onKeyPress={(event) => {
                handleKeyPress(event);
              }}
              value={ratings}
              name="ratings"
              rows={1}
              onChange={(e) => {
                if (
                  e &&
                  e.target &&
                  e.target.value > 0 &&
                  e.target.value <= 5
                ) {
                  onChangeFormData(e, setRatings);
                }
                // need check  setRatings(parseFloat(e.target.value))
              }}
              label="Product Ratings"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic3"
              fullWidth
              size="small"
              label="Product Code"
              name="product_code"
              value={productCode}
              onChange={(e) => onChangeFormData(e, setProductCode)}
            />
            <RequiredFieldTag />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />

            <Box>
              <TextField
                id="outlined-basic1"
                type="number"
                name="quantity"
                size="small"
                onKeyPress={(event) => {
                  handleKeyPress(event);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                value={quantity}
                fullWidth
                label="Product Quantity"
                onChange={(e) => {
                  onChangeFormData(e, setQuantity);
                }}
              />
              <RequiredFieldTag />
            </Box>

            {/* product price will calculate from backend according to selected vehicle details */}
            <Box mt={2}>
              <TextField
                label="Original Price"
                id="original-price"
                type="number"
                name="original_price"
                value={orignalPrice}
                fullWidth
                size="small"
                onChange={(e) => onChangeFormData(e, setOrignailPrice)}
                InputProps={
                  ({
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  },
                  { inputProps: { min: 0 } })
                }
                onKeyPress={(event) => {
                  handleKeyPress(event);
                }}
              />
              <RequiredFieldTag />
            </Box>

            <Box mt={2}>
              <TextField
                id="availability-input"
                select
                label="Availability"
                size="small"
                name="availability"
                fullWidth
                value={isAvailabilty}
                onChange={(event) => onChangeFormData(event, setAvailability)}
              >
                {availabilty.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <RequiredFieldTag />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
            <TextField
              id="standard-select-currency"
              select
              size="small"
              value={vehicleCategory}
              name="vehicleCategory"
              label="Vehicle Category"
              fullWidth
              onChange={(event) => setVehicleCategory(event.target.value)}
            >
              {vehicleCategoryList &&
                vehicleCategoryList.length > 0 &&
                vehicleCategoryList.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={vehicleCategory === option.id ? true : false}
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            {isVehicleDetailsRequired && <RequiredFieldTag />}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              value={brand}
              size="small"
              name="brand_id"
              label="Vehicle Brand"
              fullWidth
              onChange={(event) => {
                setModel(null);
                setModelVariant(null);
                setBrand(event.target.value);
              }}
            >
              {brandList &&
                brandList.length > 0 &&
                brandList.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={brand === option.id ? true : false}
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            {isVehicleDetailsRequired && <RequiredFieldTag />}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="standard-select-currency"
              select
              value={model}
              size="small"
              name="model_id"
              label="Vehicle Model"
              fullWidth
              onChange={(event) => setModel(event.target.value)}
            >
              {modelList &&
                modelList.length > 0 &&
                modelList.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    selected={model === option.id ? true : false}
                  >
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            {isVehicleDetailsRequired && <RequiredFieldTag />}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic3"
              fullWidth
              size="small"
              label="Model Variant"
              name="modelVariant"
              value={modelVariant}
              onChange={(e) => onChangeFormData(e, setModelVariant)}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />

            <Typography variant="subtitle1" align="left">
              Images
            </Typography>
            <Box>
              <ImageUploader handleImages={handleImages} img={images} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />

            <Typography variant="subtitle1" align="left">
              Videos
            </Typography>
            <div>
              <VideoUploader
                handleVideos={handleVideos}
                video={videos}
                setVideos={setVideos}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />

            <Typography variant="subtitle1" align="left">
              Tags
            </Typography>
            <Select
              id="tags"
              multiple
              fullWidth
              size="small"
              name="tags"
              value={tags}
              onChange={(event) => {
                onChangeFormData(event, setTags);
              }}
              input={<Input id="tags" />}
              renderValue={(selected) => {
                return (
                  <div>
                    {typeof selected !== "string" &&
                      selected &&
                      selected.length > 0 &&
                      selected.map((value, index) => (
                        <Chip key={index} label={value} />
                      ))}
                  </div>
                );
              }}
              MenuProps={MenuProps}
            >
              {tagNames.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">Variant</Typography>

              {!!(variant && variant[0] && Object.keys(variant[0])?.length) &&
                (variant[0]?.material_id ||
                  variant[0]?.major_color_id ||
                  variant[0]?.design_id) && (
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => setVariant({})}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
            </Box>

            <Grid container spacing={2}>
              {variantCountArray &&
                variantCountArray.map((v) => {
                  return (
                    <React.Fragment key={v}>
                      {v !== 0 && (
                        <Button
                          onClick={() => {
                            setVariantCount(variantCount - 1);

                            if (
                              variant &&
                              Object.keys(variant).length > 0 &&
                              variant[`${v}`]
                            ) {
                              const obj = { ...variant };
                              delete obj[`${v}`];
                              setVariant(obj);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}

                      <Grid item xs={12}>
                        <TextField
                          id="standard-select-currency"
                          select
                          value={
                            variant &&
                            variant[`${v}`] &&
                            variant[`${v}`].design_id
                              ? variant[`${v}`].design_id
                              : ""
                          }
                          name="design_id"
                          label="Design List"
                          fullWidth
                          size="small"
                          onChange={(event) => {
                            let obj =
                              variant &&
                              Object.keys(variant).length > 0 &&
                              variant[`${v}`]
                                ? variant[`${v}`]
                                : {};
                            setVariant({
                              ...variant,
                              [v]: {
                                ...obj,
                                design_id: event.target.value,
                              },
                            });
                          }}
                        >
                          {designList &&
                            designList.length > 0 &&
                            designList.map((option) => {
                              return (
                                <MenuItem
                                  key={option.id}
                                  value={option.id}
                                  selected={
                                    variant &&
                                    variant[`${v}`] &&
                                    variant[`${v}`]?.design_id &&
                                    variant[`${v}`].design_id === option.id
                                      ? true
                                      : false
                                  }
                                >
                                  {option.name}
                                </MenuItem>
                              );
                            })}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          id="standard-select-currency"
                          select
                          size="small"
                          value={
                            variant &&
                            variant[`${v}`] &&
                            variant[`${v}`].material_id
                              ? variant[`${v}`].material_id
                              : ""
                          }
                          name="material_id"
                          label="Material List"
                          fullWidth
                          onChange={(event) => {
                            let obj =
                              variant &&
                              Object.keys(variant).length > 0 &&
                              variant[`${v}`]
                                ? variant[`${v}`]
                                : {};
                            setVariant({
                              ...variant,
                              [v]: {
                                ...obj,
                                material_id: event.target.value,
                              },
                            });
                          }}
                        >
                          {materialList &&
                            materialList.length > 0 &&
                            materialList.map((option) => (
                              <MenuItem
                                selected={
                                  variant &&
                                  variant[`${v}`] &&
                                  variant[`${v}`]?.material_id &&
                                  variant[`${v}`].material_id === option.id
                                    ? true
                                    : false
                                }
                                key={option.id}
                                value={option.id}
                              >
                                {option.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          id="standard-select-currency"
                          select
                          size="small"
                          name="major_id"
                          label="Major Colors"
                          fullWidth
                          value={
                            variant &&
                            variant[`${v}`] &&
                            variant[`${v}`].major_color_id
                              ? variant[`${v}`].major_color_id
                              : ""
                          }
                          onChange={(event) => {
                            const obj =
                              variant &&
                              Object.keys(variant).length > 0 &&
                              variant[`${v}`]
                                ? variant[`${v}`]
                                : {};

                            setVariant({
                              ...variant,
                              [v]: {
                                ...obj,
                                major_color_id: event.target.value,
                              },
                            });
                          }}
                        >
                          {colorList &&
                            colorList.length > 0 &&
                            colorList.map((v) => (
                              <MenuItem
                                selected={
                                  variant &&
                                  variant[`${v}`] &&
                                  variant[`${v}`]?.major_color_id &&
                                  variant[`${v}`].major_color_id === v.id
                                    ? true
                                    : false
                                }
                                key={v.id}
                                value={v.id}
                              >
                                <Box display="flex">
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      background: v.hexadecimal_code,
                                      border: 1,
                                      borderColor: "#000",
                                    }}
                                  />
                                  <span style={{ marginLeft: 8 }}>
                                    {v.name}
                                  </span>
                                </Box>
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Minor Colors
                        </Typography>
                        <Select
                          id="minorColors"
                          multiple
                          fullWidth
                          name="minor_colors"
                          size="small"
                          value={
                            variant &&
                            variant[`${v}`] &&
                            variant[`${v}`].minor_color_ids &&
                            variant[`${v}`].minor_color_ids.length > 0
                              ? variant[`${v}`].minor_color_ids
                              : []
                          }
                          onChange={(event) => {
                            let obj =
                              variant &&
                              Object.keys(variant).length > 0 &&
                              variant[`${v}`]
                                ? variant[`${v}`]
                                : {};
                            setVariant({
                              ...variant,
                              [v]: {
                                ...obj,
                                minor_color_ids: [...event.target.value],
                              },
                            });
                          }}
                          input={<Input id="minorColors" />}
                          renderValue={(selected) => {
                            let colorArr = [];
                            (selected || []).forEach((s) => {
                              const data =
                                colorList &&
                                colorList.length > 0 &&
                                colorList.find(
                                  (c) => Number(c.id) === Number(s)
                                );

                              if (data && Object.keys(data).length > 0) {
                                colorArr.push(`${data.name}`);
                              }
                            });

                            return colorArr.join(", ");
                          }}
                          MenuProps={MenuProps}
                        >
                          {colorList &&
                            colorList.length > 0 &&
                            colorList.map((v) => (
                              <MenuItem key={v.id} value={v.id}>
                                <Box display="flex">
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      background: v.hexadecimal_code,
                                      border: 1,
                                      borderColor: "#000",
                                    }}
                                  />
                                  <span style={{ marginLeft: "20px" }}>
                                    {v.name}
                                  </span>
                                </Box>
                              </MenuItem>
                            ))}
                        </Select>
                      </Grid>
                    </React.Fragment>
                  );
                })}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
            <Typography variant="subtitle1">Sections</Typography>
            <Box display="flex">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={section.trending ? true : false}
                    name="trending"
                    onChange={(e) => onChangeFormData(e, setSection)}
                  />
                }
                label="Trending"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="latest"
                    checked={section.latest ? true : false}
                    onChange={(e) => onChangeFormData(e, setSection)}
                  />
                }
                label="Latest"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 4 }} />
            <Typography variant="subtitle1" align="left">
              Suggestion
            </Typography>
            <Select
              id="suggestion"
              multiple
              fullWidth
              size="small"
              value={suggestions}
              name="suggestions"
              onChange={(event) => {
                onChangeFormData(event, setSuggestions);
              }}
              input={<Input id="suggestion" />}
              renderValue={(selected) => {
                let vehicleArr = [];
                selected &&
                  selected.map((s) => {
                    const data =
                      vehicleList &&
                      vehicleList.length > 0 &&
                      vehicleList.find((v) => Number(v.id) === Number(s));

                    if (data && Object.keys(data).length > 0) {
                      vehicleArr.push(
                        `${data?.brand?.name} ${data?.brand_model?.name}`
                      );
                    }
                  });

                return vehicleArr.join(", ");
              }}
              MenuProps={MenuProps}
            >
              {vehicleList &&
                vehicleList.length > 0 &&
                vehicleList.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {(v?.brand && v?.brand?.name) || ""}-{" "}
                    {(v?.brand_model && v?.brand_model?.name) || ""} - {v.year}
                  </MenuItem>
                ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ marginBottom: 1 }}
            >
              SEO Details
            </Typography>

            <TextField
              fullWidth
              name="seoPageTitle"
              label="SEO Page Title"
              size="small"
              value={seoPageTitle}
              onChange={(e) => onChangeFormData(e, setSeoPageTitle)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="SEO Page Description"
              multiline
              rows={5}
              size="small"
              name="seoPageDescription"
              value={seoPageDescription}
              onChange={(e) => onChangeFormData(e, setSeoPageDescription)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              fullWidth
              label="Canonical URL"
              value={canonicalUrl}
              size="small"
              name="canonicalUrl"
              onChange={(e) => onChangeFormData(e, setCanonicalUrl)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <AnimateButton>
          <LoadingButton
            size="medium"
            type="submit"
            disabled={
              !category ||
              !productName ||
              !orignalPrice ||
              parseInt(orignalPrice) < 1 ||
              !productDescription ||
              !vehicleType ||
              !productCode ||
              !isAvailabilty ||
              !quantity ||
              !additionalInfo ||
              (isVehicleDetailsRequired &&
                (!vehicleCategory || !brand || !model))
            }
            onClick={() => handleCreateProduct()}
            loading={loading}
            loadingPosition="center"
            variant="contained"
          >
            {productInfo.id ? "Update" : "Create"}
          </LoadingButton>
        </AnimateButton>
        <Button variant="outlined" color="error" onClick={handleCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductAdd;
