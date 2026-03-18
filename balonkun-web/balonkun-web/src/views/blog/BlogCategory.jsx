import React, { useEffect, useState } from "react";
import { Col, Row, Breadcrumb, BreadcrumbItem, Container } from "reactstrap";
import CategoriesListWidget from "./Components/CategoriesListWidget";
import BlogsListWidget from "./Components/BlogsListWidget";
import { useDispatch } from "react-redux";
import * as actions from '@redux/actions';
import BlogArticle from "./Components/BlogArticle";
import { Pagination } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet';

const BlogCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { pageNumber, category: categoryId } = useParams();

    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [pagination, setPagination] = useState({
        count: 10,
        page: pageNumber
    });

    const currentPageNumber = pageNumber ? Number(pageNumber) : 1;

    useEffect(() => {
        dispatch(
            actions.getCategoryBlogs({
                category: categoryId,
                page: currentPageNumber
            }, (response) => {
                setBlogs(response.list)
                setPagination(prev => ({
                    ...prev,
                    count: response.no_of_pages,
                    page: response.page
                }))
            })
        );

        dispatch(
            actions.getCategories({}, (categories) => {
                setCategories(categories)
            })
        );
    }, [dispatch, categoryId, currentPageNumber]);

    const handlePageChange = (event, pageNumber) => {
        if (currentPageNumber !== pageNumber) {
            navigate(`/blogs/category/${categoryId}/${pageNumber}`)
        }
    }

    const category = categories.find(category => category.id === Number(categoryId));

    return (
        <div>
            {category && <div className="category-banner">
                <h1>{category.name}</h1>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to="/blogs">Blogs</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {category.name}
                    </BreadcrumbItem>
                </Breadcrumb>

                <Helmet>
                    <script type="application/ld+json">{`
                        {
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "item": {
                                        "@id": "https://autoformindia.com",
                                        "name": "Home"
                                    }
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "item": {
                                        "name": "Blogs",
                                        "@id": "https://autoformindia.com/blogs"
                                    }
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "item": {
                                        "name": "${category.name}"
                                    }
                                }
                            ]
                        }
                        `}
                    </script>
                </Helmet>
            </div>}
            <Container style={{ marginTop: "2rem" }}>
                <Row>
                    <Col xs={12} xl={8}>
                        <Row>
                            {
                                blogs.map(blog => (
                                    <Col xl={6} xs={12} key={blog.id}>
                                        <BlogArticle blog={blog} />
                                    </Col>
                                ))
                            }

                            {pagination.count > 1 && blogs.length > 0 && <div className="pagination-wrapper">
                                <Pagination count={pagination.count} color="primary" page={pagination.page} onChange={handlePageChange} />
                            </div>}

                        </Row>
                    </Col>
                    <Col xs={12} xl={4}>
                        <div className='widgets'>
                            {categories.length > 0 && <CategoriesListWidget title="Explore Topics" categoriesList={categories} />}
                            <BlogsListWidget title="Popular Posts" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default BlogCategory;