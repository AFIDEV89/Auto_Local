import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axios";
import ProductAdd from "../../customer/Product/ProductAdd";

import {
  Button,
  Divider,
  Grid,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteModal from "../components/deleteModal";

import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import StarBorderTwoToneIcon from "@mui/icons-material/StarBorderTwoTone";
import { successAlert, apiErrorHandler } from "../../../helpers";
import usePermission from "hooks/usePermission";

const ProductInfo = ({ getProductDetail, productInfo = {} }) => {
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { isUserModerator } = usePermission()

  const handleClickOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/product/delete/${productInfo.id}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setTimeout(() => {
          successAlert("Product deleted successfully.");
          history("/products");
        }, 300);
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Product."
      );
    }
  };

  const handleListInText = () => {
    if (productInfo.sections["latest"] && productInfo.sections["trending"]) {
      return "Latest, Trending";
    } else if (productInfo.sections["latest"]) {
      return "Latest";
    } else if (productInfo.sections["trending"]) {
      return "Trending";
    }
    return "";
  };

  const productVariants = productInfo?.product_variants || [];

  return (
    <>
      {open && (
        <ProductAdd
          open={open}
          handleCloseDialog={handleCloseDialog}
          productInfo={productInfo}
          getProductDetail={getProductDetail}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h3">{productInfo.name}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">{productInfo.detail}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating
              name="simple-controlled"
              value={parseFloat(productInfo.ratings)}
              icon={<StarTwoToneIcon fontSize="inherit" />}
              emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
              precision={0.1}
              readOnly
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h2" color="primary">
              {productInfo.discounted_price > 0 ? `₹${productInfo.discounted_price || 0}` : `₹${productInfo.original_price || 0}`}
            </Typography>
            {productInfo.discounted_price > 0 && <Typography variant="body1" sx={{ textDecoration: "line-through" }}>
              ₹{productInfo.original_price || 0}
            </Typography>}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={10}>
              <Table>
                <TableBody
                  sx={{ "& .MuiTableCell-root": { borderBottom: "none" } }}
                >
                  {productVariants.map((item, index) => {
                    return (
                      <>
                        <TableRow key={`variant-${item.id}`}>
                          <TableCell>
                            <Typography variant="body2">
                              Variant {index + 1} Avalaible:{" "}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <span>
                              <div>
                                <span key={`design-${item.id}`}>
                                  {" "}
                                  {item?.design?.name} (Material -{" "}
                                  {item?.material?.name})
                                </span>
                              </div>
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`major-color-${item.id}`}>
                          <TableCell>
                            <Typography variant="body2">
                              Variant Major Color:{" "}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <span>
                              <div>
                                <span key={`color-${item.id}`}> {item?.color?.name || '-'}</span>
                              </div>
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`minor-colors-${item.id}`}>
                          <TableCell>
                            <Typography variant="body2">
                              Variant Minor Color:{" "}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {item?.product_variant_minor_colors &&
                              item.product_variant_minor_colors.map((p) => {
                                return (
                                  <span key={`minor-color-${item.id}`}>
                                    <div>
                                      <span>
                                        {p?.color?.name || "-"}
                                      </span>
                                    </div>
                                  </span>
                                );
                              })}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}

                  <TableRow>
                    <TableCell>
                      <Typography variant="body2">Category: </Typography>
                    </TableCell>
                    <TableCell>
                      {productInfo.category && productInfo.category.name ? productInfo.category.name : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2">Brand: </Typography>
                    </TableCell>
                    <TableCell>{productInfo?.brand?.name ? productInfo?.brand?.name : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2">Product Code: </Typography>
                    </TableCell>
                    <TableCell>{productInfo.product_code ? productInfo.product_code : '-'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body2">Quantity: </Typography>
                    </TableCell>
                    <TableCell align="left">{productInfo.quantity}</TableCell>
                  </TableRow>
                  {productInfo.sections &&
                    (productInfo.sections["latest"] ||
                      productInfo.sections["trending"]) && (
                      <TableRow>
                        <TableCell align="left">
                          <Typography variant="body2">Listed in: </Typography>
                        </TableCell>
                        <TableCell>{handleListInText()}</TableCell>
                      </TableRow>
                    )}
                  {productInfo.tags && productInfo.tags.length > 0 && (
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2">Tags: </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {productInfo.tags && productInfo.tags.join(", ")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {!isUserModerator && <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    size="large"
                    onClick={handleClickOpenDialog}
                  >
                    Edit Product
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => setDeleteModal(true)}
                    type="submit"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    size="large"
                  >
                    Delete Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>}
          </Grid>
        </Grid>
      </Grid>

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Product"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Product"
        />
      )}
    </>
  );
};

ProductInfo.propTypes = {
  product: PropTypes.object,
};

export default ProductInfo;
