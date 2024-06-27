
import React, { useEffect, useState } from "react";
import {
    AppPageContainer
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import { db } from "../backend/firebase";
import { collection, getDocs } from "firebase/firestore"; 

const AppHomepage = () => {
    const navigate = useNavigate();
    const navigateStockHomePage = () => {
      navigate("/stock");
    };
    const navigateOrderHomePage = () => {
        navigate("/order");
      };

    return (
      <ThemeProvider theme={theme}>
        <AppPageContainer>
            <Button 
                defaultColor={theme.primary} 
                filledColor={theme.primary} 
                filled={false} 
                onClick={() => navigateStockHomePage()} 
            >
                Check Stock
            </Button>
            <Button 
                defaultColor={theme.primary} 
                filledColor={theme.primary} 
                filled={false} 
                onClick={() => navigateOrderHomePage()} 
            >
                Check Order Detail
            </Button>
        </AppPageContainer>
      </ThemeProvider>
    );
  };

  
export default AppHomepage;