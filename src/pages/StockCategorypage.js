
import React, { useEffect, useState } from "react";
import {
    StockPageContainer,
    PageTitle,
    StockButtonContainer,
    StockContainer,
    StockTable,
    StockTableHeader,
    StockTableRow,
    StockTableData,
    StyledLink 
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { db } from "../backend/firebase";
import { collection, getDocs } from "firebase/firestore"; 
import { Link } from 'react-router-dom';

const StockCategorypage = () => {
    const navigate = useNavigate();
    const navigateStockHomePage = () => {
        navigate("/");
      };
    const navigateStockOrderPage = () => {
      navigate("/stock/order");
    };
    const navigateStockAddPage = () => {
        navigate("/stock/add_stock");
      };

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "categories"));
            const categoriesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    useEffect(() => {
        fetchCategories();
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
                        onClick={() => navigateStockHomePage()} 
                    >
                        Home
                    </Button>
                    <Button 
                        defaultColor={theme.primary} 
                        filledColor={theme.primary} 
                        filled={false} 
                        onClick={() => ""} 
                    >
                        Add Category
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
                        onClick={() => navigateStockOrderPage()} 
                    >
                        Create Order
                    </Button>
                </StockButtonContainer>
                <StockTable>
                    <StockTableRow>
                        <StockTableHeader>Name</StockTableHeader>
                        <StockTableHeader colspan="2">Action</StockTableHeader>
                    </StockTableRow>
                    {categories.map((stock) => (
                        <StockTableRow key={stock.id}>
                            <StockTableData>
                                <StyledLink  to={`/stock/${stock.id}`}>
                                    {stock.name}
                                </StyledLink >
                            </StockTableData>
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

  
export default StockCategorypage;