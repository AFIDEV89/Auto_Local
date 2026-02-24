import React from "react";
import { addThreeDots } from '@utils';
import { dateFormatter } from "@utils/date";
import { Link } from "react-router-dom";

const BlogGridMainArticle = ({
    blog
}) => {
    return (
        <div className="blog-main-article">
            <Link to={`/blog/${blog.id}`}>
                <img src={blog.image} alt="blog" loading="lazy" />
            </Link>

            <div className="content-section">
                <div className="blog-meta">
                    {blog.creator_name} <span /> {dateFormatter(blog.createdAt)}
                </div>

                <Link to={`/blog/${blog.id}`}>
                    <h3 className="blog-title">{blog.title}</h3>
                </Link>
                <p className="description">{addThreeDots(blog.description, 150)}</p>
            </div>
        </div>
    )
}

export default BlogGridMainArticle;