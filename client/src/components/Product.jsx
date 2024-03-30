import { useEffect, useState } from "react";
import "./Product.css";

import ProductAvailability from "./ProductAvailability";

export default function Product({ productDetails }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/availability`);

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }

        throw new Error(`got response from server: ${response.statusText}`);
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  const productAvailabilityDetails = data.filter(
    (availability) => availability.product_id == product.id
  );

  return (
    <div className="productDetail">
      <p className="productName">{productDetails.product_name}</p>
      <ProductAvailability availabilityDetails={productAvailabilityDetails} />
    </div>
  );
}
