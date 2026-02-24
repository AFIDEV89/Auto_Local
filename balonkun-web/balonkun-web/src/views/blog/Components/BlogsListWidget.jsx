import React, { useEffect, useState } from "react";
import { divider } from "@assets/images";
import { dateFormatter } from "@utils/date";
import { useDispatch } from "react-redux";
import * as actions from '@redux/actions';
import { Link } from "react-router-dom";

const BlogsListWidget = ({
    title
}) => {
    const dispatch = useDispatch();
    const [blogs, setBlogs] = useState([]);
 
    useEffect(() => {
        dispatch(
            actions.getPopularBlogs({}, (blogs) => { 
             setBlogs(blogs)
            })
        );
    }, [dispatch]);

    return (
        <div className="blogs-list-wrapper widget">
            <div className="widgetTitleSection">
                <h3>{title}</h3>
                <img src={divider} alt="" />
            </div>

            <div className="blogs-list">
                {
                    blogs.map(blog => {
                        return (<div key={blog.id} className="blog-item">
                            <img src={blog.image} alt="blog" loading="lazy" width="60" height="60" />
                            <div className="content">
                                <Link to={`/blog/${blog.id}`}>
                                    <h3 className="blog-title">{blog.title}</h3>
                                </Link>
                                <p className="date-creation">{dateFormatter(blog.createdAt)}</p>
                            </div>
                        </div>)
                    })
                }
            </div>

        </div>
    )
}

export default BlogsListWidget;