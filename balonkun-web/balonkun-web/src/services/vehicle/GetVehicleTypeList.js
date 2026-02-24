import config from "./Config"
import { getDataApi } from "../ApiCaller"

export const getVehicleTypeList = () => {
  const request = config.getVehicleTypeList
  return getDataApi(request)
}

