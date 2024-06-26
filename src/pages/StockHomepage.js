
import React from "react";
import {
    StockPageContainer,
    PageTitle,
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

const StockHomepage = () => {
    const navigate = useNavigate();
    const navigateUpdate = () => {
      navigate("/stock/update");
    };

    const dummyData = [
        { 
            id: 1, 
            name: 'Stock A', 
            price: '$100',
            quantity: 10
        },
        { 
            id: 2, 
            name: 'Stock B', 
            price: '$200',
            quantity: 10
        },
        { 
            id: 3, 
            name: 'Stock C', 
            price: '$300',
            quantity: 8
        },
        { 
            id: 4, 
            name: 'Stock D', 
            price: '$400',
            quantity: 10
        }
    ];

    
  
    return (
      <ThemeProvider theme={theme}>
        <StockPageContainer>
            <PageTitle>Stock Dashboard</PageTitle>
            <StockContainer>
                <StockTable>
                    <StockTableRow>
                        <StockTableHeader>Name</StockTableHeader>
                        <StockTableHeader>Price</StockTableHeader>
                        <StockTableHeader>Quantity</StockTableHeader>
                        <StockTableHeader>Action</StockTableHeader>
                    </StockTableRow>
                    {dummyData.map((stock) => (
                        <StockTableRow key={stock.id}>
                            <StockTableData>{stock.name}</StockTableData>
                            <StockTableData>{stock.price}</StockTableData>
                            <StockTableData>{stock.quantity}</StockTableData>
                            <StockTableData>
                                <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigateUpdate()}>
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