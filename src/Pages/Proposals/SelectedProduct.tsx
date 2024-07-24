import React, { useEffect, useState } from 'react';
import { Divider, Input } from 'antd';
import './Proposal.css';

// const { Title } = Typography;

interface ProductProps {
  name: string;
  fnTotalCost: (value: number) => void;
  unitPrice: number;
  description: string;
}
const SelectedProduct: React.FC<ProductProps> = ({
  name,
  unitPrice,
  description,
  fnTotalCost,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const handleProductQuantity = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(event.target.value);
    setQuantity(isNaN(value) ? 0 : value);
  };
  const totalOrderValue = quantity * unitPrice;
  useEffect(() => {
    fnTotalCost(totalOrderValue);
  }, [quantity]);
  return (
    <>
      <div className="AddProposal-products-div">
        <div className="name-container">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>

        <p>
          Quantity:
          <Input
            type="number"
            onChange={handleProductQuantity}
            className="quantity-input"
          />
        </p>
        <p>
          Unit Price:
          {unitPrice}
        </p>
        <div className="total-price-container">
          <p>Total</p>
          <p className="total-order">{totalOrderValue}</p>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default SelectedProduct;
