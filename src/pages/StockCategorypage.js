
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
import { collection, getDocs, addDoc, query, where, deleteDoc,doc } from "firebase/firestore"; 
import Modal from "../components/Modal/Modal";

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
      const [showAddModal, setShowAddModal] = useState(false);
      const [inputValue, setInputValue] = useState("");
      const [attribute, setAttribute] = useState("");
      const [showErrorModal1, setShowErrorModal1] = useState(false);
      const [showErrorModal2, setShowErrorModal2] = useState(false);

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

    const handleAddCategory = async (categoryName, attribute) => {
        if (!categoryName || !attribute) {
            setInputValue("");
            setAttribute("");
            setShowErrorModal2(true);
            return;
          }

        try {
            const capitalizedCategoryName = categoryName.toUpperCase();
        
            const q = query(collection(db, "categories"), where("name", "==", capitalizedCategoryName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setInputValue("");
                setAttribute("");
                setShowErrorModal1(true);
            return;
            }
      
          // Add a new document with a generated ID to the "categories" collection
          const docRef = await addDoc(collection(db, "categories"), {
            name: capitalizedCategoryName,
            attribute: attribute === "true", // Convert attribute to boolean
          });
      
          console.log("Document written with ID: ", docRef.id);
            setInputValue("");
            setAttribute("");
      
          fetchCategories(); // Refresh categories after adding
        } catch (e) {
          console.error("Error adding document: ", e);
        }
    };

    const handleRemoveCategory = async (categoryId) => {
        try {
            await deleteDoc(doc(db, "categories", categoryId));
            console.log("Document successfully deleted!");
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    },[]);

    return (
      <ThemeProvider theme={theme}>
        <StockPageContainer>
            <Modal
                handleModalClose={() => {
                    setShowErrorModal1(false);
                }}
                actionButtonText="OK"
                actionButtonColor={theme.statusGood}
                show={showErrorModal1}
                modalTitle="Category Name exists!"
                modalContent="Please use another name"
            />
            <Modal
                handleModalClose={() => {
                    setShowErrorModal2(false);
                }}
                actionButtonText="OK"
                actionButtonColor={theme.statusGood}
                show={showErrorModal2}
                modalTitle="Missed Info!"
                modalContent="Please fill in all the information"
            />
            <Modal
                handleModalClose={() => {
                    setShowAddModal(false);
                }}
                modalType="addCategory"
                actionButtonText="Yes"
                actionButtonColor={theme.statusGood}
                actionButtonClick={handleAddCategory}
                show={showAddModal}
                modalTitle="Add Category"
                modalContent="What you want to add?"
                inputValue={inputValue}
                setInputValue={setInputValue}
                attribute={attribute}
                setAttribute={setAttribute}
            />
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
                        onClick={() => setShowAddModal(true)} 
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
                                <Button defaultColor={theme.statusError} filledColor={theme.statusError} filled={false} onClick={() => handleRemoveCategory(stock.id)}>
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