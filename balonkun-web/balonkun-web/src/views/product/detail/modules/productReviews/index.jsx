import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Review from "./Review";
import * as actions from '@redux/actions';
import { Divider } from "@mui/material";

const ProductReviews = ({
    productId
}) => {
    const dispatch = useDispatch();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        dispatch(actions.getProductReviewsRequest({ productId }, (response) => {
            if (response) {
                setReviews(response)
            }
        }))
    }, [dispatch, productId])

    return (
        <div className="reviewsWrapper">
            {
                reviews.map((review, index) => (
                    <div key={`review_${review.id}`}>
                        <Review
                            img={review.author_pic}
                            authorName={review.author}
                            comment={review.comment}
                            time={review.updatedAt}
                        />
                        {index < (reviews.length - 1) && <Divider variant="fullWidth" style={{ margin: "10px 0", borderColor: "#949494" }} />}
                    </div>
                )
                )
            }

            {
                reviews.length === 0 && <p>No reviews found</p>
            }
        </div>
    )
}

export default ProductReviews;