"use strict";

export const paramRemover = (url = "") => {
    if (!url?.includes("?")) return url;
    return url.split("?")[0];
};

export const getId = (url = "") => {
    if (!url?.includes("/")) return url;
    return url.split("/").pop();
};
