import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../backend/firebase';
import {
  OrderDetailContainer,
  OrderDetailContent,
  OrderDetailHeader,
  OrderDetailPara,
  OrderDetailHeader2,
  OrderProductTable,
  OrderProductThead,
  OrderProductTh,
  OrderProductTd,
  StockButtonContainer,
  OrderTitle
} from "./StockPageStyles";
import Button from "../components/Button/Button";
import { theme } from "../theme";

const OrderDetailpage = () => {
  const navigate = useNavigate();
  const { addStockID } = useParams();
  const [addStock, setAddStock] = useState({
    id: '',
    date: '',
    name: '',
    orders: []
  });

  const fetchAddStock = async () => {
    try {
      const docRef = doc(db, "addstocks", addStockID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const addStockData = {
          id: docSnap.id,
          ...docSnap.data()
        };
        setAddStock(addStockData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching order: ", error);
    }
  };

  useEffect(() => {
    fetchAddStock();
  }, [addStockID]);

  return (
    <OrderDetailContainer>
      <OrderTitle>Add Stock Detail</OrderTitle>
      <StockButtonContainer>
        <Button 
            defaultColor={theme.primary} 
            filledColor={theme.primary} 
            filled={false} 
            onClick={() => navigate("/")} 
        >
            Home
        </Button>
        <Button 
            defaultColor={theme.primary} 
            filledColor={theme.primary} 
            filled={false} 
            onClick={() => navigate("/add_stock")} 
        >
            Back
        </Button>
        <Button 
            defaultColor={theme.primary} 
            filledColor={theme.primary} 
            filled={false} 
            onClick={() => navigate("/order")} 
        >
            Check Order Detail
        </Button>
      </StockButtonContainer>    
      <OrderDetailContent>
        <OrderDetailHeader>Order ID: {addStock.id}</OrderDetailHeader>
        <OrderDetailPara>Date: {addStock.date}</OrderDetailPara>
      </OrderDetailContent>
      <OrderDetailContent>
        <OrderDetailPara>name: {addStock.name}</OrderDetailPara>
      </OrderDetailContent>
      <OrderDetailContent>
        <OrderDetailHeader2>Products</OrderDetailHeader2>
        <OrderProductTable>
          <OrderProductThead>
            <tr>
              <OrderProductTh>Product Name</OrderProductTh>
              <OrderProductTh>Quantity</OrderProductTh>
              <OrderProductTh>Price</OrderProductTh>
              <OrderProductTh>Total</OrderProductTh>
            </tr>
          </OrderProductThead>
          <tbody>
            {addStock.orders.map((product, index) => (
              <tr key={index}>
                <OrderProductTd>{product.productName}</OrderProductTd>
                <OrderProductTd>{product.productQuantity}</OrderProductTd>
                <OrderProductTd>RM {product.productPrice}</OrderProductTd>
                <OrderProductTd>RM {product.productQuantity * product.productPrice}</OrderProductTd>
              </tr>
            ))}
          </tbody>
        </OrderProductTable>
      </OrderDetailContent>
    </OrderDetailContainer>
  );
};

export default OrderDetailpage;
