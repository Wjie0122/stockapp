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
  const { orderID } = useParams();
  const [order, setOrder] = useState({
    id: '',
    date: '',
    customerName: '',
    customerCode:'',
    orders: []
  });

  const fetchOrder = async () => {
    try {
      const docRef = doc(db, "orders", orderID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = {
          id: docSnap.id,
          ...docSnap.data()
        };
        setOrder(orderData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching order: ", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderID]);

  return (
    <OrderDetailContainer>
      <OrderTitle>Order Detail</OrderTitle>
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
            onClick={() => navigate("/order")} 
        >
            Back
        </Button>
        <Button 
            defaultColor={theme.primary} 
            filledColor={theme.primary} 
            filled={false} 
            onClick={() => navigate("/add_stock")} 
        >
            Check Add Stock Detail
        </Button>
      </StockButtonContainer>    
      <OrderDetailContent>
        <OrderDetailHeader>Order ID: {order.id}</OrderDetailHeader>
        <OrderDetailPara>Date: {order.date}</OrderDetailPara>
      </OrderDetailContent>
      <OrderDetailContent>
        <OrderDetailPara>Customer: {order.customerName}</OrderDetailPara>
      </OrderDetailContent>
      <OrderDetailContent>
        <OrderDetailPara>Customer Code: {order.customerCode}</OrderDetailPara>
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
            {order.orders.map((product, index) => (
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
