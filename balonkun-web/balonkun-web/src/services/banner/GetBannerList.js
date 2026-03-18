import config from "./Config"
import { getDataApi } from "../ApiCaller"

export const getBannerList = () => {
  const request = config.getBannerList
  return getDataApi(request)
}

