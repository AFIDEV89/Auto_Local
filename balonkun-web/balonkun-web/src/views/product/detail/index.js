import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as actions from "@redux/actions";
import { getProductPictures } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DetailComponent from "./Component";
import { addToWishList } from "../../../services";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const userDetails = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [isOpenSelectVehicleModal, setToggleSelectVehicleModal] = useState(false);

  const pictures = useMemo(() => getProductPictures(product), [product]);

  const isProductFetched = Object.keys(product).length > 0

  const isNotSelectedVehicleDetails = useMemo(() => !userDetails.vehicleTypeId || !userDetails.vehicleBrandId || !userDetails.vehicleBrandModelId, [userDetails]);

  const isValidProductForUser = useMemo(() => {
    return !!(
      !(product.vehicle_detail) ||
      (
        ((userDetails.vehicleTypeId === product.vehicle_type_id) || (userDetails.vehicleTypeId === product.vehicle_detail.vehicle_type_id)) &&
        (product.vehicle_detail.brand_id && userDetails.vehicleBrandId === product.vehicle_detail.brand_id) &&
        (product.vehicle_detail.model_id && userDetails.vehicleBrandModelId === product.vehicle_detail.model_id)
      )
    );
  }, [product.vehicle_detail, userDetails, product.vehicle_type_id]);

  const handleSelectVehicleModal = useCallback((value) => {
    setToggleSelectVehicleModal(value);
  }, []);

  useEffect(() => {
    if (productId) {
      dispatch(
        actions.getProductRequest(productId, (res) => {
          setProduct(res);
        }, () => {
          navigate("/not-found")
        })
      );
    }
  }, [dispatch, productId, navigate]);

  const handleAddToCart = (pid, isDirectBuy = false) => {
    if (userDetails.isLogin) {
      dispatch(actions.cartProductCreate(pid, () => {
        if (isDirectBuy) {
          navigate("/my-cart");
        }
      }));
    } else {
      navigate("/login");
    }
  };

  const handleUserVehicle = useCallback((vtid) => {
    if (userDetails.isLogin) {
      dispatch(
        actions.updateUserProfileRequest({
          vehicle_type_id: parseInt(vtid),
        })
      );
    }
  },
    [dispatch, userDetails.isLogin]
  );

  useEffect(() => {
    if (isProductFetched) {
      // Only open modal if no vehicle is selected at all
      if (isNotSelectedVehicleDetails) {
        handleSelectVehicleModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotSelectedVehicleDetails, product]);

  return (
    <DetailComponent
      navigate={navigate}
      product={product}
      isValidProductForUser={isValidProductForUser}
      userDetails={userDetails}
      isOpenSelectVehicleModal={isOpenSelectVehicleModal}
      pictures={pictures}
      onAddToCart={handleAddToCart}
      onSetUserVehicle={handleUserVehicle}
      onToggleSelectVehicleModal={handleSelectVehicleModal}
      addToWishList={() => addToWishList(product.id)}
    />
  );
}

export default ProductDetail;
