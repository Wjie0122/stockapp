
import React, { useEffect, useState } from "react";
import {
    StockPageContainer,
    PageTitle,
    StockButtonContainer,
    StockContainer,
    StockTable,
    StockTableHeader,
    StockTableRow,
    StockTableData
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { db } from "../backend/firebase";
import { collection, getDocs } from "firebase/firestore"; 

const StockHomepage = () => {
    const navigate = useNavigate();
    const navigateOrderPage = () => {
      navigate("/stock/order");
    };
    const navigateStockAddPage = () => {
        navigate("/stock/add_stock");
      };

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    },[]);

    
  
    return (
      <ThemeProvider theme={theme}>
        <StockPageContainer>
            <PageTitle>Stock Dashboard</PageTitle>
            <StockContainer>
                <StockButtonContainer>
                    <Button 
                        defaultColor={theme.primary} 
                        filledColor={theme.primary} 
                        filled={false} 
                        onClick={() => ""} 
                    >
                        Add Product
                    </Button>
                    <Button 
                        defaultColor={theme.primary} 
                        filledColor={theme.primary} 
                        filled={false} 
                        onClick={() => navigateStockAddPage()} 
                    >
                        Add Stock
                    </Button>
                    <Button 
                        defaultColor={theme.primary} 
                        filledColor={theme.primary} 
                        filled={false} 
                        onClick={() => navigateOrderPage()} 
                    >
                        Create Order
                    </Button>
                </StockButtonContainer>
                <StockTable>
                    <StockTableRow>
                        <StockTableHeader>Name</StockTableHeader>
                        <StockTableHeader>Price</StockTableHeader>
                        <StockTableHeader>Quantity</StockTableHeader>
                        <StockTableHeader colspan="2">Action</StockTableHeader>
                    </StockTableRow>
                    {products.map((stock) => (
                        <StockTableRow key={stock.productID}>
                            <StockTableData>{stock.productName}</StockTableData>
                            <StockTableData>RM {stock.productPrice}</StockTableData>
                            <StockTableData>{stock.productQuantity}</StockTableData>
                            <StockTableData>
                                <Button defaultColor={theme.statusGood} filledColor={theme.statusGood} filled={false} onClick={() => ""}>
                                    Edit
                                </Button>
                            </StockTableData>
                            <StockTableData>
                                <Button defaultColor={theme.statusError} filledColor={theme.statusError} filled={false} onClick={() => ""}>
                                    Remove
                                </Button>
                            </StockTableData>
                        </StockTableRow>
                    ))}
                </StockTable>
            </StockContainer>
        </StockPageContainer>
      </ThemeProvider>
    );
  };

  
export default StockHomepage;