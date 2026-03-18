import React from "react";
import { Col, Row } from "reactstrap";
import BlogGridMainArticle from "./BlogGridMainArticle";
import BlogGridArticle from "./BlogGridArticle";

import { divider } from "@assets/images";

const BlogGrid = ({
    title,
    blogs = []
}) => {
    const mainBlog = blogs.slice(0, 1);
    const restBlogs = blogs.slice(1);

    return (
        <div className="blog">
            <div className="blog-heading">
                <h2 className="blog-section-title">{title}</h2>
                <img src={divider} alt="" />
            </div>
            <div className="blogs-wrapper">
                <Row>
                    <Col md={6}>
                        {
                            mainBlog.map(blog => {
                                return <BlogGridMainArticle blog={blog} key={blog.id} />
                            })
                        }
                    </Col>
                    <Col md={6}>
                        {
                            restBlogs.map(blog => {
                                return <BlogGridArticle blog={blog} key={blog.id} />
                            })
                        }
                    </Col>
                </Row>

            </div>

        </div>
    )
}

export default BlogGrid;