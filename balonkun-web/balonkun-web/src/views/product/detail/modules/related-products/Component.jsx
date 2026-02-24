import React from "react";
import { Link } from "react-router-dom";
import { faCircleInfo, faEyeSlash, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons/faCartPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addThreeDots, getProductPicture, formatNumberToIndian } from '@utils';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardImg,
	Col,
	Row,
} from 'reactstrap';
import { Colors } from '../../../listing/components';
import { ROUTES } from '@shared/constants';
import { imageNotAvailable } from "@assets/images";
import { Box, Rating, Tooltip } from "@mui/material";
import { addToWishList } from "../../../../../services";
import { useSelector } from "react-redux";

const RelatedProducts = ({
	related_products,
	onProductClick,
	onAddToCart,
	onNavigation,
}) => {
	const { isLogin } = useSelector(state => state.user);

	return (
		<Box className="related-products">
			<Row>
				{related_products.list.map((item, i) => {
					const title = addThreeDots(item.name);
					const picture = getProductPicture(item);

					return (
						<Col
							className="hand-icon"
							xs={12}
							lg={6}
							key={i}
							onClick={() => onProductClick(item)}
						>
							<Card>
								<Box className="thumbnail-wrapper">
									<CardImg src={picture || imageNotAvailable} alt={title} loading="lazy" />

									<Box className="overlay-wrapper">
										<Box className="overlap-box">
											<Box className="btn-area">
												<button onClick={(e) => {
													e.stopPropagation();
													onProductClick(item)
												}}>
													<FontAwesomeIcon icon={faEyeSlash} />
												</button>
												<button onClick={(e) => {
													e.stopPropagation();
													onAddToCart(item.id);
												}}>
													<FontAwesomeIcon icon={faCartPlus} />
												</button>
												{isLogin && <button onClick={(e) => {
													e.stopPropagation();
													addToWishList(item.id);
												}}>
													<FontAwesomeIcon icon={faHeart} />
												</button>}
											</Box>
										</Box>
									</Box>
								</Box>

								<CardBody onClick={() => onProductClick(item)}>
									<Link className='card-title' to={`${ROUTES.PRODUCT}/${item.seo_canonical || item.id}`}>
										{title}
									</Link>
									<Colors product={item} />
								</CardBody>

								<CardFooter>
									<Box>
										<Rating value={item.ratings} size="small" precision={0.1} readOnly />
										{(item.reviews && Object.keys(item.reviews).length > 0) ? <span>{`(${Object.keys(item.reviews).length} reviews)`}</span> : ""}
									</Box>
									<Box>
										<p className={`price ${item.discounted_price ? "cut-price" : ""} `}>
											&#8377;{formatNumberToIndian(item.original_price)}
										</p>
										<Tooltip title="(incl. of all taxes)" arrow>
											<Box>
												<FontAwesomeIcon icon={faCircleInfo} />
											</Box>
										</Tooltip>
									</Box>
								</CardFooter>
							</Card>
						</Col>
					);
				})}
				<Col xs={12} className="text-center">
					<Button className="view-all" onClick={() => onNavigation()}>
						View All
					</Button>
				</Col>
			</Row>
		</Box>
	);
}

export default RelatedProducts;
