// components/OrderHomepage.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../backend/firebase';
import {
    OrderContainer,
    OrderTitle,
    OrderList,
    OrderItem,
    PaginationNav,
    PaginationList,
    PaginationItem,
    PaginationLink,
    StockButtonContainer
  } from "./StockPageStyles";
import { theme } from "../theme";
import Button from "../components/Button/Button";
import { useNavigate, Link } from "react-router-dom";

const OrderHomepage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <OrderContainer>
      <OrderTitle>Orders</OrderTitle>
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
            Check Add Stock Detail
        </Button>
      </StockButtonContainer>     
      <OrderList>
        {currentOrders.map(order => (
          <OrderItem key={order.id}>
            <Link to={`/order/${order.id}`}>
              Customer: {order.customerName} ({order.customerCode}), Date: {order.date}
            </Link>
          </OrderItem>
        ))}
      </OrderList>
      <Pagination
        ordersPerPage={ordersPerPage}
        totalOrders={orders.length}
        paginate={paginate}
      />
    </OrderContainer>
  );
};

const Pagination = ({ ordersPerPage, totalOrders, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationNav>
      <PaginationList>
        {pageNumbers.map(number => (
          <PaginationItem key={number}>
            <PaginationLink
              onClick={() => paginate(number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationList>
    </PaginationNav>
  );
};

export default OrderHomepage;
