import {validations} from "../../common/joi.js";

export const createBlogAuthor = {
    name: validations.string,
    image_path: validations.string,
}
export const updateBlogAuthor = {
    id: validations.positive_integer,
    ...createBlogAuthor
};
export const getBlogAuthor = {
    id: validations.positive_integer,
};