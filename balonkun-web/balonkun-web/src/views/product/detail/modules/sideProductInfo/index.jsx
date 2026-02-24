import React from "react"
import { formatNumberToIndian, titleCase } from "@utils"
import { Colors } from "../../../listing/components"
import { ProductMaterials } from ".."
import Rating from "@mui/material/Rating"

const SideProductInfo = ({ product }) => {
    return (
        <div className="side-product-info">
            <h2 className="side-title">Product Details</h2>

            <ul>
                <li itemprop="offers" itemscope="" itemtype="https://schema.org/Offer">
                    <span className="label">Price</span>
                    <div itemprop="price">
                        <span itemprop="priceCurrency" content="INR">₹</span>
                        <span itemprop="price" content={product.original_price}>
                            {formatNumberToIndian(product.original_price)}
                        </span>
                        <span className="price-info"> (incl. of all taxes)</span>
                    </div>
                </li>
                <li itemprop="aggregateRating" itemscope="" itemtype="https://schema.org/AggregateRating">
                    <span className="label">Rating</span>
                    <div>
                        <span itemprop="ratingValue" hidden>{product.ratings}</span>
                        <Rating value={product.ratings ? Number(product.ratings) : 0} size="small" precision={0.1} readOnly />
                    </div>
                </li>
                <li>
                    <span className="label">Vehicle Brand:</span>
                    {titleCase(product.vehicle_detail?.brand?.name || '-')}
                </li>
                <li>
                    <span className="label">Vehicle Model:</span>
                    {titleCase(product.vehicle_detail?.brand_model?.name || '-')}
                </li>
                <li>
                    <span className="label">Product Code:</span>
                    {product.product_code || '-'}
                </li>
                <li>
                    <span className="label">Availability:</span>
                    {product.availability === 'yes' ? 'In Stock' : 'Out Of Stock'}
                </li>
                <li>
                    <span className="label">Color</span>
                    <div><Colors product={product} /></div>
                </li>
                <li>
                    <span className="label">Material</span>
                    <ProductMaterials product={product} />
                </li>
            </ul>
        </div>
    )
}

export default SideProductInfo