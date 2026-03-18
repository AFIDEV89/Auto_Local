"use strict";

export const isArray = (list) => {
    return list && Array.isArray(list) && list.length;
};

export const isObject = (obj) => {
    return obj && typeof obj === 'object' && !!Object.keys(obj)?.length;
};
