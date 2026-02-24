"use strict";
import config from "../../config.js";

export function getModuleBaseUrl(name) {
  return config.API_BASE_URL + name
}

export function getApiUrl(module, route) {
  return getModuleBaseUrl(module) + route
}
