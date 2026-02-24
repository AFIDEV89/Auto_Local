import React from 'react';
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import { infoTabs } from './mockData';
import { ProductReviews, RelatedProducts } from './modules';

const ProductInfoTabs = ({ product }) => {

  const [infoTab, setInfoTab] = React.useState({
    id: 1,
    tabName: 'Description',
  });

  const categoryMap = {
    'Related Products': product.category_id,
    'Related Mats': 3,
    'Related Accessories': 2
  }

  const filteredInfoTabs = infoTabs.filter(tab => tab.shouldRender(product))

  return (
    <div className="product-info-tabs">
      <Nav tabs role='tablist'>
        {
          filteredInfoTabs.map((nav) => {
            return (
              <NavItem key={nav.tabName} role='tab'>
                <NavLink
                  className={nav.id === infoTab.id ? 'active' : ''}
                  onClick={() => setInfoTab(nav)}
                >
                  {nav.tabName}
                </NavLink>
              </NavItem>
            );
          })
        }
      </Nav>

      {
        infoTab.tabName === 'Description' && (
          product?.description
            ? <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              itemprop="description"
            />
            : <div>
              No Description
            </div>
        )
      }

      {
        infoTab.tabName === 'Additional Info' && (
          product?.additional_info
            ? <div
              dangerouslySetInnerHTML={{ __html: product.additional_info }}
            />
            : <div>
              No Additional Info
            </div>
        )
      }

      {
        ['Related Products', 'Related Mats', 'Related Accessories'].includes(infoTab.tabName) && (
          <RelatedProducts
            product={product}
            productCategoryId={categoryMap[infoTab.tabName]}
          />
        )
      }

      {
        infoTab.id === 6 && (<ProductReviews productId={product.id} />)
      }
    </div>
  );
}

export default ProductInfoTabs;
