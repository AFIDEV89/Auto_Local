import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '@redux/actions';
import {
    Col,
    Row,
    Container
} from 'reactstrap';
import BlogGrid from './Components/BlogsGrid';
import CategoriesListWidget from './Components/CategoriesListWidget';
import BlogsListWidget from './Components/BlogsListWidget';
import HeaderBlog from './Components/HeaderBlog';
import { Helmet } from 'react-helmet';

const Blogs = () => {
    const dispatch = useDispatch();
    const [blogs, setBlogs] = useState([]);
    const [headerBlog, setHeaderBlog] = useState();

    useEffect(() => {
        dispatch(
            actions.getBlogListRequest({}, (blogs) => {
                setBlogs(blogs)
            })
        );

        dispatch(
            actions.getHeaderBlogRequest({}, (blog) => {
                setHeaderBlog(blog)
            })
        );
    }, [dispatch]);

    return (
        <Container style={{ marginTop: "2rem" }}>
            <Row>
                <Col xs={12} xl={8}>
                    <Helmet>
                        <title>NEWS | NEW LAUNCH | UPCOMING CARS | ELECTRIC/GREENS | TIPS & ADVICE | EVENT & AWARDS | Festivals | REVIEWS</title>
                        <meta name='description' content="Stay up to date with the latest blog updates from Autoform India. Explore insightful articles on automotive trends, technology, and industry news." />
                    </Helmet>
                    {headerBlog && <HeaderBlog blog={headerBlog} />}
                    {
                        blogs.map(blogSection => {
                            if (blogSection.blogs.length === 0) {
                                return <></>
                            }

                            return <BlogGrid title={blogSection.name} key={blogSection.id} blogs={blogSection.blogs} />
                        })
                    }
                </Col>
                <Col xs={12} xl={4}>
                    <div className='widgets'>
                        <CategoriesListWidget title="Explore Topics" />
                        <BlogsListWidget title="Popular Posts" />
                    </div>
                </Col>
            </Row>

        </Container>
    )
}

export default Blogs;