import React from "react";
import { dateFormatter } from "@utils/date";
import { Link } from "react-router-dom";

const HeaderBlog = ({
    blog
}) => {
    return (
        <div id="feature-blog">
            <div className="details" >
                <Link className="badge" to={`/blogs/category/${blog.blog_category.id}`}>
                    {blog.blog_category.name}
                </Link>
                <h2 className="post-title">{blog.title}</h2>
                <div className="blog-meta">
                    {blog.creator_name} <span /> {dateFormatter(blog.createdAt)}
                </div>
            </div>

            <Link to={`/blog/${blog.id}`}>
                <div className="thumb">
                    <div className="inner" style={{
                        backgroundImage: `url(${blog.image})`
                    }}></div>
                </div>

            </Link>
        </div>
    )
}

export default HeaderBlog