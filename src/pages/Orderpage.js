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
    StockOrderInput,
    RemoveRowButton
} from "./StockPageStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import { db } from "../backend/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import StockRow from '../components/StockRow/StockRow';

const OrderPage = () => {
    const [customerName, setCustomerName] = useState('');
    const [date, setDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(''); // Track selected product
    const [orderRows, setOrderRows] = useState([]);

    const navigate = useNavigate();

    const fetchCategories = async () => {
        const categoriesCollection = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCategories(categoriesList);
    };

    const fetchProducts = async () => {
        const productsCollection = await getDocs(collection(db, 'products'));
        const productsList = productsCollection.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    
        // Use a Set to track unique product IDs
        const uniqueProductIDs = new Set();
        const uniqueProducts = [];
    
        productsList.forEach(product => {
            // Check if product ID is already in the Set
            if (!uniqueProductIDs.has(product.productID)) {
                uniqueProductIDs.add(product.productID); // Add product ID to Set
                uniqueProducts.push(product); // Push product to uniqueProducts array
            }
        });
    
        setProducts(uniqueProducts); // Set all products (if needed)
        setAvailableProducts(uniqueProducts); // Initialize available products with unique product IDs
    };
    
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        // Filter products based on selected category and exclude already selected products
        const filteredProducts = products.filter(product => product.categoryID === value && !orderRows.find(row => row.productID === product.id));
        setAvailableProducts(filteredProducts);
        setSelectedProduct(''); // Reset selected product when category changes
    };

    const handleProductNameChange = (value) => {
        setSelectedProduct(value); // Set selected product name

        const selectedProductObj = availableProducts.find(product => product.productName === value);

        if (selectedProductObj) {
            const newOrderRow = {
                productName: selectedProductObj.productName,
                productID: selectedProductObj.productID,
                productQuantity: '',
                category: selectedCategory,
            };
            setOrderRows([...orderRows, newOrderRow]);
            setAvailableProducts(availableProducts.filter(product => product !== selectedProductObj));
        }
    };

    const handleRemoveRow = (index) => {
        const removedProduct = orderRows[index];
    
        // Remove the row from the orderRows state
        setOrderRows(orderRows.filter((_, idx) => idx !== index));
    
        // Reset selected product to default (empty string)
        setSelectedCategory('');
        setSelectedProduct('');
    };
    

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        try {
            // Update product quantities in Firestore
            await Promise.all(orderRows.map(async row => {
                const productRef = doc(db, 'products', row.productID);
                const productDoc = await getDoc(productRef);

                if (productDoc.exists()) {
                    const currentQuantity = productDoc.data().productQuantity;
                    const newQuantity = currentQuantity - parseInt(row.productQuantity, 10);

                    await updateDoc(productRef, {
                        productQuantity: newQuantity
                    });
                } else {
                    console.error('Product document not found');
                }
            }));

            // Add a new order document to the orders collection
            await addDoc(collection(db, 'orders'), {
                customerName,
                date,
                orders: orderRows.map(row => ({
                    productName: row.productName,
                    productID: row.productID,
                    productQuantity: parseInt(row.productQuantity, 10)
                })),
                timestamp: new Date()
            });

            // Navigate back to the stock dashboard or show a success message
            navigate('/stock/home');
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
                <PageTitle>Stock Order</PageTitle>
                <StockUpdateForm onSubmit={handleUpdateStock}>
                    <StockUpdateInput
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
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
                        {selectedCategory && (
                            <StockOrderRow>
                                <StockOrderLabel>Product Name</StockOrderLabel>
                                <StockOrderSelect
                                    value={selectedProduct || ''}
                                    onChange={(e) => handleProductNameChange(e.target.value)}
                                >
                                    <option value="">Select a product</option>
                                    {availableProducts.map(product => (
                                        <option key={product.id} value={product.productName}>
                                            {product.productName}
                                        </option>
                                    ))}
                                </StockOrderSelect>
                            </StockOrderRow>
                        )}
                        {orderRows.map((row, index) => (
                            <StockRow
                                key={index}
                                productName={row.productName}
                                productID={row.productID}
                                productQuantity={row.productQuantity}
                                category={row.category}
                                onQuantityChange={(e) => handleRowChange(index, 'productQuantity', e.target.value)}
                                onRemove={() => handleRemoveRow(index)}
                            />
                        ))}
                    </StockOrderContainer>
                    <StockUpdateButton type="submit">Make An Order</StockUpdateButton>
                </StockUpdateForm>
            </StockUpdateContainer>
        </ThemeProvider>
    );
};

export default OrderPage;
