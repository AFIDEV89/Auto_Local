import React from "react";
import { dateFormatter } from "@utils/date";
import { Link } from "react-router-dom";

const BlogGridArticle = ({
    blog
}) => {
    return <div className="blog-article">
        <Link to={`/blog/${blog.id}`}>
            <img src={blog.image} alt="blog" loading="lazy" width="150" height="100"/>
        </Link>

        <div className="content-section">
            <Link to={`/blog/${blog.id}`}>
                <h3 className="blog-title">{blog.title}</h3>
            </Link>
            <p className="date-creation">{dateFormatter(blog.createdAt)}</p>
        </div>
    </div>
}

export default BlogGridArticle;