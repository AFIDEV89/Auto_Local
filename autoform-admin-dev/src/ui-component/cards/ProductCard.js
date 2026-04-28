import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// material-ui
import {
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

// project import
import MainCard from "./MainCard";
import SkeletonProductPlaceholder from "ui-component/cards/Skeleton/ProductPlaceholder";
import { IconEye, IconEyeOff } from '@tabler/icons';
import usePermission from "hooks/usePermission";

const ProductCard = ({
  id,
  color,
  name,
  image,
  description,
  offerPrice,
  salePrice,
  rating,
  isShowOrignalPrice,
  isHide,
  onHideShowProduct
}) => {
  const { isUserModerator } = usePermission()
  const prodProfile = image;
  const [productRating] = useState(rating);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonProductPlaceholder />
      ) : (
        <MainCard
          content={false}
          boxShadow
          sx={{
            "&:hover": {
              transform: "scale3d(1.02, 1.02, 1)",
              transition: "all .4s ease-in-out",
            },
          }}
        >
          <CardMedia
            sx={{ height: 220 }}
            image={prodProfile}
            title="Contemplative Reptile"
            component={Link}
            to={`/product-details/${id}`}
          />
          <CardContent sx={{ p: 2 }}>
            <Grid container justifyContent="space-between">
              <Grid item xs={6}>
                <Typography
                  component={Link}
                  to={`/product-details/${id}`}
                  variant="subtitle1"
                  sx={{ textDecoration: "none" }}
                >
                  {name}
                </Typography>
              </Grid>
              {!isUserModerator && <Grid item xs={6} textAlign="right">
                {isHide
                  ? <IconEyeOff
                    className="eyeIcon"
                    color="#2196f3"
                    cursor={true}
                    title="Hide"
                    onClick={() => { onHideShowProduct(id); }}
                  />
                  : <IconEye
                    className="eyeIcon"
                    color="#2196f3"
                    onClick={() => { onHideShowProduct(id); }}
                  />
                }
              </Grid>}
              {description && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      height: 45,
                    }}
                  >
                    {description}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sx={{ pt: "8px !important" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating
                    precision={0.5}
                    name="size-small"
                    value={productRating}
                    size="small"
                    readOnly
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography variant="h4">₹{offerPrice || 0}</Typography>
                    </Grid>
                    {isShowOrignalPrice && <Grid item>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "grey.500",
                          textDecoration: "line-through",
                        }}
                      >
                        ${salePrice || 0}
                      </Typography>
                    </Grid>}
                  </Grid>

                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

ProductCard.propTypes = {
  id: PropTypes.number,
  color: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  offerPrice: PropTypes.number,
  salePrice: PropTypes.number,
  rating: PropTypes.number,
};

export default ProductCard;
