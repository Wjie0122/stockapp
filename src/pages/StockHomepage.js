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
  DropdownContainer,
  DropdownHeader,
  DropdownContent
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button/Button";
import { db } from "../backend/firebase";
import { collection, deleteDoc, doc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import Modal from "../components/Modal/Modal";

const StockHomepage = () => {
  const { categoryID } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const [showErrorModal1, setShowErrorModal1] = useState(false);
  const [showErrorModal2, setShowErrorModal2] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [pv, setPv] = useState("");
  const [productToEdit, setProductToEdit] = useState(null); 
  const [productToRemove, setProductToRemove] = useState(null); 

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

  const fetchProductTypes = async () => {
    try {
      const q = query(collection(db, "productTypes"), where("categoryID", "==", categoryID));
      const querySnapshot = await getDocs(q);
      const productTypesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductTypes(productTypesData);
    } catch (error) {
      console.error("Error fetching product types: ", error);
    }
  };

  const handleAddProduct = async (productID,productName,productPrice,pv) => {
    if (!productID || !productName || !productPrice || !pv) {
        setProductID("");
        setProductName("");
        setProductPrice("");
        setPv("");
        setShowErrorModal2(true);
        return;
      }

    try {
        const capitalizedProductName = productName.toUpperCase();
        const capitalizedProductID = productID.toUpperCase();
    
        const queryByName = query(collection(db, "products"), where("productName", "==", capitalizedProductName));
        const queryByProductID = query(collection(db, "products"), where("productID", "==", capitalizedProductID));

        const querySnapshotByName = await getDocs(queryByName);
        const querySnapshotByProductID = await getDocs(queryByProductID);

        if (!querySnapshotByName.empty || !querySnapshotByProductID.empty) {
            setProductID("");
            setProductName("");
            setProductPrice("");
            setPv("");
            setShowErrorModal1(true);
        return;
        }
  
      // Add a new document with a generated ID to the "categories" collection
      const docRef = await addDoc(collection(db, "products"), {
        categoryID: categoryID,
        productID: capitalizedProductID,
        productName: capitalizedProductName,
        productPrice: Number(productPrice),
        pv: Number(pv),
        productQuantity: 0,
      });
  
      console.log("Document written with ID: ", docRef.id);
        setProductID("");
        setProductName("");
        setProductPrice("");
        setPv("");
  
        fetchProducts(); // Refresh categories after adding
    } catch (e) {
      console.error("Error adding document: ", e);
    }
};

const handleEditProduct = async (id, newProductID, newProductName, newProductPrice, newPv) => {
  try {

    const capitalizedProductName = productName.toUpperCase();
        const capitalizedProductID = productID.toUpperCase();
        const docRef1 = doc(db, "products", id);
    
        const queryByName = query(collection(db, "products"), where("productName", "==", capitalizedProductName),where("__name__", "!=", docRef1.id));
        const queryByProductID = query(collection(db, "products"), where("productID", "==", capitalizedProductID),where("__name__", "!=", docRef1.id));

        const querySnapshotByName = await getDocs(queryByName);
        const querySnapshotByProductID = await getDocs(queryByProductID);

        if (!querySnapshotByName.empty || !querySnapshotByProductID.empty) {
            setProductID("");
            setProductName("");
            setProductPrice("");
            setPv("");
            setShowErrorModal1(true);
        return;
        }

    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
        productID: newProductID.toUpperCase(),
        productName: newProductName.toUpperCase(),
        productPrice: Number(newProductPrice),
        pv: Number(newPv),
    });
    console.log("Document successfully updated!");
    setProductID("");
        setProductName("");
        setProductPrice("");
        setPv("");
    fetchProducts(); // Refresh categories after updating
    setProductToEdit(null);
    setShowEditModal(false);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const handleRemoveProduct = async (productId) => {
  try {
      await deleteDoc(doc(db, "products", productId));
      console.log("Document successfully deleted!");
      fetchProducts(); // Refresh categories after deletion
      setProductToRemove(null);
  } catch (error) {
      console.error("Error removing document: ", error);
  }
};

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, [categoryID]);

  const toggleDropdown = (productType) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [productType]: !prevState[productType]
    }));
  };

  const renderProductRows = (productid) => {
    return products
      .filter((product) => product.productID === productid)
      .map((stock) => (
        <StockTableRow key={stock.productID}>
          <StockTableData>{stock.productID}</StockTableData>
          <StockTableData>{stock.productName}</StockTableData>
          <StockTableData>RM {stock.productPrice}</StockTableData>
          <StockTableData>{stock.pv} pts</StockTableData>
          <StockTableData>{stock.size}</StockTableData>
          <StockTableData>{stock.color}</StockTableData>
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
      ));
  };

  const renderDropdowns = () => {
    return productTypes
      .filter((type) => type.attributes)
      .map((type) => (
        <DropdownContainer key={type.id}>
          <DropdownHeader onClick={() => toggleDropdown(type.name)}>
            {type.name}
          </DropdownHeader>
          <DropdownContent isOpen={isDropdownOpen[type.name]}>
            <StockTable>
              <StockTableRow>
                <StockTableHeader>Code</StockTableHeader>
                <StockTableHeader>Name</StockTableHeader>
                <StockTableHeader>Price</StockTableHeader>
                <StockTableHeader>PV</StockTableHeader>
                <StockTableHeader>Size</StockTableHeader>
                <StockTableHeader>Color</StockTableHeader>
                <StockTableHeader>Quantity</StockTableHeader>
                <StockTableHeader colSpan="2">Action</StockTableHeader>
              </StockTableRow>
              {renderProductRows(type.productID)}
            </StockTable>
          </DropdownContent>
        </DropdownContainer>
      ));
  };

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
          modalTitle="Product Info exists!"
          modalContent="Please use another name or code"
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
          show={showAddModal}
          handleModalClose={() => {
            setShowAddModal(false);
            setProductID("");
            setProductName("");
            setProductPrice("");
            setPv("");
          }}
          modalType="addProduct"
          modalTitle="Add New Product"
          actionButtonText="Add Product"
          actionButtonColor={theme.statusGood}
          actionButtonClick={handleAddProduct}
          productID={productID}
          setProductID={setProductID}
          productName={productName}
          setProductName={setProductName}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          pv={pv}
          setPv={setPv}
        />
        <Modal
          show={showEditModal}
          handleModalClose={() => {
            setShowEditModal(false);
            setProductID("");
            setProductName("");
            setProductPrice("");
            setPv("");
          }}
          modalType="addProduct"
          modalTitle="Edit Product"
          actionButtonText="Save"
          actionButtonColor={theme.statusGood}
          actionButtonClick={() => handleEditProduct(productToEdit.id, productID, productName,productPrice,pv)}
          productID={productID}
          setProductID={setProductID}
          productName={productName}
          setProductName={setProductName}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          pv={pv}
          setPv={setPv}
        />
        <Modal
                handleModalClose={() => {
                    setShowRemoveModal(false);
                }}
                modalType="action"
                actionButtonText="Yes"
                actionButtonColor={theme.statusGood}
                actionButtonClick={() => handleRemoveProduct(productToRemove)} 
                show={showRemoveModal}
                modalTitle="Remove Product"
                modalContent="Are you sure want to remove this product?"
            />
        <PageTitle>Stock Dashboard</PageTitle>
        <StockContainer>
          <StockButtonContainer>
            <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/")}>
              Home
            </Button>
            <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/stock")}>
              Back
            </Button>
            <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => setShowAddModal(true)}>
              Add Product
            </Button>
            <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/stock/add_stock")}>
              Add Stock
            </Button>
            <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/stock/order")}>
              Create Order
            </Button>
          </StockButtonContainer>
          {productTypes.some((type) => type.attributes) ? renderDropdowns() : (
            <StockTable>
              <StockTableRow>
                <StockTableHeader>Code</StockTableHeader>
                <StockTableHeader>Name</StockTableHeader>
                <StockTableHeader>Price</StockTableHeader>
                <StockTableHeader>PV</StockTableHeader>
                <StockTableHeader>Quantity</StockTableHeader>
                <StockTableHeader colSpan="2">Action</StockTableHeader>
              </StockTableRow>
              {products.map((stock) => (
                <StockTableRow key={stock.productID}>
                  <StockTableData>{stock.productID}</StockTableData>
                  <StockTableData>{stock.productName}</StockTableData>
                  <StockTableData>RM {stock.productPrice}</StockTableData>
                  <StockTableData>{stock.pv} pts</StockTableData>
                  <StockTableData>{stock.productQuantity}</StockTableData>
                  <StockTableData>
                    <Button
                      defaultColor={theme.statusGood}
                      filledColor={theme.statusGood}
                      filled={false}
                      onClick={() => {
                        setProductToEdit(stock);
                        setProductID(stock.productID);
                        setProductName(stock.productName);
                        setProductPrice(stock.productPrice);
                        setPv(stock.pv);
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
                    setProductToRemove(stock.id);
                    setShowRemoveModal(true); 
                  }}>
                    Remove
                  </Button>
                  </StockTableData>
                </StockTableRow>
              ))}
            </StockTable>
          )}
        </StockContainer>
      </StockPageContainer>
    </ThemeProvider>
  );
};

export default StockHomepage;
