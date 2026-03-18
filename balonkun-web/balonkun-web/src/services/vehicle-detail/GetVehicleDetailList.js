import config from "./Config";
import { getDataApi } from "../ApiCaller";

export const getVehicleDetailList = () => {
  const request = config.getVehicleDetailList;
  return getDataApi(request);
};
