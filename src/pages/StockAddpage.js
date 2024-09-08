import React, { useEffect, useState } from "react";
import {
    StockUpdateContainer,
    PageTitle,
    StockUpdateForm,
    StockUpdateInput,
    StockUpdateButton,
    StockOrderContainer,
    StockOrderRow,
    StockOrderLabel,
    StockOrderSelect,
    StockButtonContainer
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import { db } from "../backend/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, where, query,orderBy } from 'firebase/firestore';
import StockRow from '../components/StockRow/StockRow';
import Button from '../components/Button/Button'

const StockAddPage = () => {
    const [selectedProductIDs, setSelectedProductIDs] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [selectedProductTypeName, setSelectedProductTypeName] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderRows, setOrderRows] = useState([]);
    const [categoryHasAttributes, setCategoryHasAttributes] = useState(false);

    const navigate = useNavigate();

    const fetchCategories = async () => {
        const categoriesRef = collection(db, 'categories'); 
        const q = query(categoriesRef, orderBy('name', 'asc'));
        const categoriesCollection = await getDocs(q);
        const categoriesList = categoriesCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCategories(categoriesList);
    };

    const fetchProducts = async (categoryID) => {
        const productsRef = collection(db, 'products');
        const q = query(
            productsRef,
            where('categoryID', '==', categoryID),
            orderBy('productID', 'asc')
          );
        const productsCollection = await getDocs(q);
        const productsList = productsCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Filter out products that are already selected
        const filteredProducts = productsList.filter(product => !selectedProductIDs.includes(product.id));
        setAvailableProducts(sortProducts(filteredProducts));
    };
    const sortProducts = (products) => {
        return products.sort((a, b) => {
          // First, sort by productID
          if (a.productID < b.productID) return -1;
          if (a.productID > b.productID) return 1;
      
          // Then, sort by color
          if (!a.color && b.color) return 1; // Place products without color after those with color
          if (a.color && !b.color) return -1; // Place products with color before those without
          if (a.color < b.color) return -1;
          if (a.color > b.color) return 1;
      
          // Finally, sort by size
          if (!a.size && b.size) return 1; // Place products without size after those with size
          if (a.size && !b.size) return -1; // Place products with size before those without
          if (a.size < b.size) return -1;
          if (a.size > b.size) return 1;
      
          return 0; // Default case if all fields are equal
        });
      };

    const fetchProductTypes = async (categoryID) => {
        const productTypesRef = collection(db, 'productTypes');
        const q = query(productTypesRef, where("categoryID", "==", categoryID));
        const productTypesCollection = await getDocs(q);
        const productTypesList = productTypesCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Filter product types based on the selected category
        setProductTypes(productTypesList);
    };

    const fetchAttributesProducts = async (productID) => {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where("productID", "==", productID));
        const productsCollection = await getDocs(q);
        const productsList = productsCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Filter out products that are already selected
        const filteredProducts = productsList.filter(product => !selectedProductIDs.includes(product.id));
        setAvailableProducts(sortProducts(filteredProducts));
    };

    useEffect(() => {
        fetchCategories();

    }, []);

    const handleCategoryChange = async (value) => {
        setSelectedProductType('');
        setSelectedProduct('');
        setSelectedCategory(value);
        const selectedCategoryObj = categories.find(category => category.id === value);
        if (selectedCategoryObj.attributes) {
            setCategoryHasAttributes(true);
            await fetchProductTypes(value);
            setSelectedProductType('');
        } else {
            setCategoryHasAttributes(false);
            //const filteredProducts = availableProducts.filter(product => product.categoryID === value && !orderRows.find(row => row.productID === product.id));
            //setAvailableProducts(filteredProducts);
            await fetchProducts(value)
            setSelectedProduct('');
        }
    };

    const handleProductTypeChange = async (value) => {
        setSelectedProductType(value);
    
        // Assuming productTypes collection in Firestore
        const productTypesRef = collection(db, 'productTypes');
        const q = query(productTypesRef, where('productID', '==', value));
    
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Assuming you want to set the name of the first document found
                const productName = querySnapshot.docs[0].data().name;
                setSelectedProductTypeName(productName);
            } else {
                console.log('No matching product type found');
                setSelectedProductTypeName(''); // Set a default value or handle accordingly
            }
        } catch (error) {
            console.error('Error fetching product type:', error);
            // Handle error as needed
        }
    
        // Assuming fetchAttributesProducts is an async function to fetch related products
        await fetchAttributesProducts(value);
    
        setSelectedProduct('');
    };

    const handleProductNameChange = (value) => {
        setSelectedProduct(value);
        const selectedProductObj = availableProducts.find(product => product.id === value);
        if (selectedProductObj) {
            const newOrderRow = {
                id: selectedProductObj.id,
                productName: selectedProductObj.productName,
                productID: selectedProductObj.productID,
                productQuantity: '',
                productPrice: selectedProductObj.productPrice,
                pv: selectedProductObj.pv,
                category: selectedCategory,
            };
            // Add the new order row to orderRows
            setOrderRows(prevOrderRows => [...prevOrderRows, newOrderRow]);
    
            // Update selectedProductIDs and availableProducts
            setSelectedProductIDs(prevSelectedProductIDs => [...prevSelectedProductIDs, value]);
            setAvailableProducts(prevAvailableProducts =>
                prevAvailableProducts.filter(product => product.id !== value)
            );
        }
        setSelectedProductType('');
        setSelectedProduct('');
        setCategoryHasAttributes(false);
        console.log(orderRows);
    };
    
    const handleAttributesProductNameChange = (value) => {
        setSelectedProduct(value);
        const selectedProductObj = availableProducts.find(product => product.id === value);
        if (selectedProductObj) {
            const newOrderRow = {
                id: selectedProductObj.id,
                productName: `${selectedProductTypeName} - ${selectedProductObj.size} - ${selectedProductObj.color}`,
                productID: selectedProductObj.productID,
                productQuantity: '',
                productPrice: selectedProductObj.productPrice,
                pv: selectedProductObj.pv,
                category: selectedCategory,
                color: selectedProductObj.color,
                size: selectedProductObj.size,
            };
            // Add the new order row to orderRows
            setOrderRows(prevOrderRows => [...prevOrderRows, newOrderRow]);
    
            // Update selectedProductIDs and availableProducts
            setSelectedProductIDs(prevSelectedProductIDs => [...prevSelectedProductIDs, value]);
            setAvailableProducts(prevAvailableProducts =>
                prevAvailableProducts.filter(product => product.id !== value)
            );
        }
        setSelectedProduct('');
        setCategoryHasAttributes(true);
        console.log(orderRows);
    };

    const handleRemoveRow = (index) => {
        const removedProduct = orderRows[index];
    
        // Remove the row from orderRows
        setOrderRows(orderRows.filter((_, idx) => idx !== index));
    
        // Update selectedProductIDs to exclude the removed product ID
        setSelectedProductIDs(prevSelectedProductIDs =>
            prevSelectedProductIDs.filter(id => id !== removedProduct.id)
        );
    
        // Refetch products for the current category or product type to include the removed product
        if (selectedCategory && !categoryHasAttributes) {
            fetchProducts(selectedCategory);
        } else if (selectedProductType) {
            fetchAttributesProducts(selectedProductType);
        }
    
        // Reset other states
        setSelectedCategory('');
        setSelectedProductType('');
        setSelectedProduct('');
        setCategoryHasAttributes(false);
        setProductTypes([]);
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        try {
            // Update product quantities in the 'products' collection
            await Promise.all(orderRows.map(async row => {
                const productRef = doc(db, 'products', row.id);
                const productDoc = await getDoc(productRef);
                if (productDoc.exists()) {
                    const currentQuantity = productDoc.data().productQuantity;
                    const newQuantity = currentQuantity + parseInt(row.productQuantity, 10);
                    await updateDoc(productRef, {
                        productQuantity: newQuantity
                    });
                } else {
                    console.error('Product document not found');
                }
            }));
    
            // Prepare orders array with dynamic attributes
            const orders = orderRows.map(row => {
                // Prepare order object based on product attributes availability
                const order = {
                    productName: row.productName,
                    productID: row.productID,
                    productQuantity: parseInt(row.productQuantity, 10),
                    productPrice: row.productPrice,
                    pv: row.pv
                };
                // Add color and size if available
                if (row.color) {
                    order.color = row.color;
                }
                if (row.size) {
                    order.size = row.size;
                }
                return order;
            });
    
            // Add order details to the 'orders' collection
            await addDoc(collection(db, 'addstocks'), {
                name,
                date,
                orders,
                timestamp: new Date()
            });
    
            // Navigate to home page after successful order placement
            navigate('/stock/');
        } catch (error) {
            console.error('Error updating stock: ', error);
        }
    };
    

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...orderRows];
        updatedRows[index][field] = value;
        setOrderRows(updatedRows);
    };

    return (
        <ThemeProvider theme={theme}>
            <StockUpdateContainer>
                <PageTitle>Add Stock</PageTitle>
                <StockButtonContainer>
                    <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/")}>
                    Home
                    </Button>
                    <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/stock")}>
                    Back
                    </Button>
                    <Button defaultColor={theme.primary} filledColor={theme.primary} filled={false} onClick={() => navigate("/stock/order")}>
                    Create Order
                    </Button>
                </StockButtonContainer>
                <StockUpdateForm onSubmit={handleUpdateStock}>
                    <StockUpdateInput
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <StockUpdateInput
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <StockOrderContainer>
                        <StockOrderRow>
                            <StockOrderLabel>Category</StockOrderLabel>
                            <StockOrderSelect
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </StockOrderSelect>
                        </StockOrderRow>
                        {categoryHasAttributes && selectedCategory && (
                            <StockOrderRow>
                                <StockOrderLabel>Product Type</StockOrderLabel>
                                <StockOrderSelect
                                    value={selectedProductType}
                                    onChange={(e) => handleProductTypeChange(e.target.value)}
                                >
                                    <option value="">Select a product type</option>
                                    {productTypes.map(productType => (
                                        <option key={productType.id} value={productType.productID}>
                                            {productType.name}
                                        </option>
                                    ))}
                                </StockOrderSelect>
                            </StockOrderRow>
                        )}
                        {(selectedCategory && !categoryHasAttributes) ? (
                            <StockOrderRow>
                                <StockOrderLabel>Product Name</StockOrderLabel>
                                <StockOrderSelect
                                    value={selectedProduct || ''}
                                    onChange={(e) => handleProductNameChange(e.target.value)}
                                >
                                    <option value="">Select a product</option>
                                    {availableProducts.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.productName}
                                        </option>
                                    ))}
                                </StockOrderSelect>
                            </StockOrderRow>
                        ) : null}
                        {selectedCategory && selectedProductType ? (
                            <StockOrderRow>
                                <StockOrderLabel>Product Name</StockOrderLabel>
                                <StockOrderSelect
                                    value={selectedProduct || ''}
                                    onChange={(e) => handleAttributesProductNameChange(e.target.value)}
                                >
                                    <option value="">Select a product</option>
                                    {availableProducts.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.size}--{product.color}
                                        </option>
                                    ))}
                                </StockOrderSelect>
                            </StockOrderRow>
                        ) : null}
                        {orderRows.map((row, index) => (
                            <StockRow
                                key={index}
                                productName={row.productName}
                                productID={row.productID}
                                productQuantity={row.productQuantity}
                                onQuantityChange={(e) => handleRowChange(index, 'productQuantity', e.target.value)}
                                onRemove={() => handleRemoveRow(index)}
                            />
                        ))}
                    </StockOrderContainer>
                    <StockUpdateButton type="submit">Add</StockUpdateButton>
                </StockUpdateForm>
            </StockUpdateContainer>
        </ThemeProvider>
    );
};

export default StockAddPage;
