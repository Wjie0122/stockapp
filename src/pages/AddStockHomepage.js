// components/OrderHomepage.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs,orderBy,query } from 'firebase/firestore';
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

const AddStockHomepage = () => {
  const navigate = useNavigate();
  const [addStocks, setAddStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addstocksPerPage] = useState(10);

  const fetchAddStocks = async () => {
    try {
      const addstocksRef = collection(db, 'addstocks');
      const q = query(addstocksRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddStocks(ordersData);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  };

  useEffect(() => {
    fetchAddStocks();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * addstocksPerPage;
  const indexOfFirstOrder = indexOfLastOrder - addstocksPerPage;
  const currentOrders = addStocks.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <OrderContainer>
      <OrderTitle>Add Stock List</OrderTitle>
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
            Check Order Detail
        </Button>
      </StockButtonContainer>     
      <OrderList>
        {currentOrders.map(order => (
          <OrderItem key={order.id}>
            <Link to={`/add_stock/${order.id}`}>
              User: {order.name}, Date: {order.date}
            </Link>
          </OrderItem>
        ))}
      </OrderList>
      <Pagination
        ordersPerPage={addstocksPerPage}
        totalOrders={addStocks.length}
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

export default AddStockHomepage;
