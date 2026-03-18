import config from "./Config"
import { getDataApi } from "../ApiCaller"

export const getCategoryList = () => {
  const request = config.getCategoryList
  return getDataApi(request)
}
