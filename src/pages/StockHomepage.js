
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
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button/Button";
import { db } from "../backend/firebase";
import { collection, getDoc, doc, getDocs, query, where } from "firebase/firestore";

const StockHomepage = (props) => {
    const { categoryID } = useParams(); 
    const navigate = useNavigate();
    const navigateAppHomePage = () => {
        navigate("/");
      };
    const navigateStockHomePage = () => {
        navigate("/stock");
      };
    const navigateStockOrderPage = () => {
      navigate("/stock/order");
    };
    const navigateStockAddPage = () => {
        navigate("/stock/add_stock");
      };

    const [products, setProducts] = useState([]);
    const [categoryAttributes, setCategoryAttributes] = useState({ color: false, size: false });

    const fetchProducts = async () => {
        try {
            const q = query(collection(db, "products"), where("categoryID", "==", categoryID));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };
    const fetchCategoryAttributes = async () => {
        try {
            const categoryDoc = await getDoc(doc(db, "categories", categoryID));
            if (categoryDoc.exists()) {
                setCategoryAttributes(categoryDoc.data().attributes);
            }
        } catch (error) {
            console.error("Error fetching category attributes: ", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategoryAttributes();
    },[categoryID]);

    
  
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
                        onClick={() => navigateAppHomePage()} 
                    >
                        Home
                    </Button>
                    <Button 
                        defaultColor={theme.primary} 
                        filledColor={theme.primary} 
                        filled={false} 
                        onClick={() => navigateStockHomePage()} 
                    >
                        Back
                    </Button>
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
                        onClick={() => navigateStockOrderPage()} 
                    >
                        Create Order
                    </Button>
                </StockButtonContainer>
                <StockTable>
                    <StockTableRow>
                        <StockTableHeader>Code</StockTableHeader>
                        <StockTableHeader>Name</StockTableHeader>
                        <StockTableHeader>Price</StockTableHeader>
                        <StockTableHeader>PV</StockTableHeader>
                        {categoryAttributes.size && <StockTableHeader>Size</StockTableHeader>}
                        {categoryAttributes.color && <StockTableHeader>Color</StockTableHeader>}
                        <StockTableHeader>Quantity</StockTableHeader>
                        <StockTableHeader colSpan="2">Action</StockTableHeader>
                    </StockTableRow>
                    {products.map((stock) => (
                        <StockTableRow key={stock.productID}>
                            <StockTableData>{stock.productID}</StockTableData>
                            <StockTableData>
                                {stock.productName}
                                {categoryAttributes.size&&stock.size ? `--${stock.size}` : ""}
                                {categoryAttributes.color&&stock.color ? `--${stock.color}` : ""}
                                </StockTableData>
                            <StockTableData>RM {stock.productPrice}</StockTableData>
                            <StockTableData>{stock.pv} pts </StockTableData>
                            {categoryAttributes.size && <StockTableData>{stock.size}</StockTableData>}
                            {categoryAttributes.color && <StockTableData>{stock.color}</StockTableData>}
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