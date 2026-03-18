"use strict";

import { QUERY_TYPE } from "../constants/index.js";
import { removeHypen } from './index.js';

export const failureError = ({ type, name }) => {
    switch (type) {
        case QUERY_TYPE.ADDING:
            return `Error in adding ${removeHypen(name)}.`;
        case QUERY_TYPE.UPDATING:
            return `Error in updating ${removeHypen(name)}.`;
        case QUERY_TYPE.FETCHING:
            return `Error in fetching ${removeHypen(name)}s.`;
        case QUERY_TYPE.DELETING:
            return `Error in deleting ${removeHypen(name)}.`;
        case QUERY_TYPE.EXIST:
            return `${removeHypen(name)} already exist.`;
        default:
            return "";
    }
};
