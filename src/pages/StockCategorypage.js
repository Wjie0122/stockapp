
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
import { collection, getDocs, addDoc, query, where, deleteDoc,doc, updateDoc  } from "firebase/firestore"; 
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
      const [attributes, setAttributes] = useState("");
      const [showErrorModal1, setShowErrorModal1] = useState(false);
      const [showErrorModal2, setShowErrorModal2] = useState(false);
      const [categoryToRemove, setCategoryToRemove] = useState(null);
      const [showRemoveModal, setShowRemoveModal] = useState(false);
      const [categoryToEdit, setCategoryToEdit] = useState(null); 
      const [showEditModal, setShowEditModal] = useState(false)

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

    const handleAddCategory = async (categoryName, attributes) => {
        if (!categoryName || !attributes) {
            setInputValue("");
            setAttributes("");
            setShowErrorModal2(true);
            return;
          }

        try {
            const capitalizedCategoryName = categoryName.toUpperCase();
        
            const q = query(collection(db, "categories"), where("name", "==", capitalizedCategoryName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setInputValue("");
                setAttributes("");
                setShowErrorModal1(true);
            return;
            }
      
          // Add a new document with a generated ID to the "categories" collection
          const docRef = await addDoc(collection(db, "categories"), {
            name: capitalizedCategoryName,
            attributes: attributes === "true", // Convert attributes to boolean
          });
      
          console.log("Document written with ID: ", docRef.id);
            setInputValue("");
            setAttributes("");
      
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
            setCategoryToRemove(null);
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    const handleEditCategory = async (categoryId, newCategoryName, newAttributes) => {
        try {
            const capitalizedCategoryName = newCategoryName.toUpperCase();
            const docRef1 = doc(db, "categories", categoryId);
        
            const q = query(collection(db, "categories"), where("name", "==", capitalizedCategoryName), where("__name__", "!=", docRef1.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setInputValue("");
                setAttributes("");
                setShowErrorModal1(true);
                return;
            }
          
            const docRef = doc(db, "categories", categoryId);
            await updateDoc(docRef, {
            name: capitalizedCategoryName,
            attributes: newAttributes === "true", // Convert attributes to boolean
          });
          console.log("Document successfully updated!");
          setInputValue("");
            setAttributes("");
          fetchCategories(); // Refresh categories after updating
          setCategoryToEdit(null);
          setShowEditModal(false);
        } catch (error) {
          console.error("Error updating document: ", error);
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
                    setShowRemoveModal(false);
                }}
                modalType="action"
                actionButtonText="Yes"
                actionButtonColor={theme.statusGood}
                actionButtonClick={() => handleRemoveCategory(categoryToRemove)} 
                show={showRemoveModal}
                modalTitle="Remove Category"
                modalContent="Are you sure want to remove this category?"
            />
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
                    setInputValue("");
                    setAttributes("");
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
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <Modal
                handleModalClose={() => {
                    setShowEditModal(false);
                    setInputValue("");
                     setAttributes("");
                }}
                modalType="addCategory"
                actionButtonText="Save"
                actionButtonColor={theme.statusGood}
                actionButtonClick={() => handleEditCategory(categoryToEdit.id, inputValue, attributes)}
                show={showEditModal}
                modalTitle="Edit Category"
                modalContent="Edit the category details below:"
                inputValue={inputValue}
                setInputValue={setInputValue}
                attributes={attributes}
                setAttributes={setAttributes}
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
                            <Button
                                defaultColor={theme.statusGood}
                                filledColor={theme.statusGood}
                                filled={false}
                                onClick={() => {
                                setCategoryToEdit(stock);
                                setInputValue(stock.name);
                                setAttributes(stock.attributes.toString());
                                setShowEditModal(true);
                                }}
                            >
                                Edit
                            </Button>
                            </StockTableData>
                            <StockTableData>
                                <Button 
                                    defaultColor={theme.statusError} 
                                    filledColor={theme.statusError} 
                                    filled={false} 
                                    onClick={() => {
                                        setCategoryToRemove(stock.id); // Set the category ID to remove
                                        setShowRemoveModal(true); // Show the remove modal
                                    }}>
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