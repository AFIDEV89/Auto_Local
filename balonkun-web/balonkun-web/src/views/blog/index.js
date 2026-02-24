import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '@redux/actions';
import { Helmet } from 'react-helmet';
import {
	Container,
	Row,
	Col,
	Breadcrumb,
	BreadcrumbItem
} from 'reactstrap';
import { dateFormatter } from "@utils/date";
import { getPageId } from '@utils';
import CategoriesListWidget from './Components/CategoriesListWidget';
import BlogsListWidget from './Components/BlogsListWidget';
import NextPrevBlog from './Components/NextPrevBlog';

const Blog = () => {
	const dispatch = useDispatch();
	const [blog, setBlog] = useState();
	const payload = getPageId();

	useEffect(() => {
		dispatch(
			actions.getBlogRequest(payload, (blog) => {
				setBlog(blog)
			})
		);
	}, [dispatch, payload]);

	const blogCategory = blog?.blog_category?.name;

	return (
		<Container className="blog-wrapper">
			<Row>
				<Col md={12} lg={12}>
					{blog && <Breadcrumb>
						<BreadcrumbItem>
							<Link to="/blogs">Blogs</Link>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<Link to={`/blogs/category/${blog.blog_category.id}`}>{blogCategory}</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>{blog.title}</BreadcrumbItem>
					</Breadcrumb>}

					{blogCategory && <Helmet>
						<title>{blog.title} | Autoform India</title>
						<meta name='description' content={`${blog.title} | Autoform India`} />
						<script type="application/ld+json">{`
                        {
                            "@context": "http://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
									"item": {
										"name": "Home",
										"@id": "https://autoformindia.com"
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
										"name": "${blogCategory}",
										"@id": "${`https://autoformindia.com/blogs/category/${blog.blog_category.id}`}"
									}
								},
								{
                                    "@type": "ListItem",
                                    "position": 4,
									"item": {
										"name": "${blog.title}",
										"@id": "https://autoformindia.com/blog/${getPageId()}"
                                    }
								}
                            ]
                        }
                        `}
						</script>
					</Helmet>}
				</Col>
			</Row>
			<Row>
				<Col xs={12} xl={8}>
					{blog && <article itemscope="" itemtype="https://schema.org/BlogPosting" itemid={`https://autoformindia.com/blog/${getPageId()}`}>

						<header>
							<h1 itemprop="name" className="blog-title">{blog.title}</h1>
							<div className="blog-meta">
								<p itemprop="author" itemscope="" itemtype="https://schema.org/Person">
									<span itemprop="name">
										{blog.creator_name}
									</span>
								</p>
								<span />
								{blogCategory}
								<span />
								<time itemprop="datePublished" datetime={blog.createdAt}>
									{dateFormatter(blog.createdAt)}
								</time>
							</div>
						</header>

						<img src={blog.image} className="blog-image" alt="blog" />

						<section itemprop="articleBody">
							<div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
						</section>
					</article>}
					{blog && <NextPrevBlog previousBlog={blog.previousBlog} nextBlog={blog.nextBlog} />}

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

export default Blog;