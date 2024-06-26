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
import { collection, addDoc, getDocs, doc, updateDoc, getDoc} from 'firebase/firestore';

const OrderPage = () => {
    const [customerName, setCustomerName] = useState('');
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderRows, setOrderRows] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = await getDocs(collection(db, 'products'));
            const productsList = productsCollection.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
            setAvailableProducts(productsList); // Initialize available products
        };

        fetchProducts();
    }, []);

    const handleProductNameChange = (value) => {
        setSelectedProduct(value);
        const selectedProduct = availableProducts.find(product => product.productName === value);

        if (selectedProduct) {
            const newOrderRow = {
                productName: selectedProduct.productName,
                productID: selectedProduct.id,
                productQuantity: ''
            };
            setOrderRows([...orderRows, newOrderRow]);
            setAvailableProducts(availableProducts.filter(product => product !== selectedProduct));
        }
    };

    const handleRemoveRow = (index) => {
        const removedProduct = orderRows[index];
        setAvailableProducts([...availableProducts, { id: removedProduct.productID, productName: removedProduct.productName }]);
        setOrderRows(orderRows.filter((_, idx) => idx !== index));
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
                            <StockOrderLabel>Product Name</StockOrderLabel>
                            <StockOrderSelect
                                value={selectedProduct}
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
                        {orderRows.map((row, index) => (
                            <StockOrderRow key={index}>
                                <StockOrderLabel>Product</StockOrderLabel>
                                <StockOrderInput
                                    type="text"
                                    value={row.productName}
                                    readOnly
                                    disabled
                                />
                                <StockOrderInput
                                    type="text"
                                    value={row.productID}
                                    readOnly
                                    hidden
                                />
                                <StockOrderLabel>Quantity</StockOrderLabel>
                                <StockOrderInput
                                    type="number"
                                    value={row.productQuantity}
                                    onChange={(e) => handleRowChange(index, 'productQuantity', e.target.value)}
                                    required
                                    placeholder="1,2,3,..."
                                    min='1'
                                />
                                <RemoveRowButton type="button" onClick={() => handleRemoveRow(index)}>
                                    Remove
                                </RemoveRowButton>
                            </StockOrderRow>
                        ))}
                    </StockOrderContainer>
                    <StockUpdateButton type="submit">Make An Order</StockUpdateButton>
                </StockUpdateForm>
            </StockUpdateContainer>
        </ThemeProvider>
    );
};

export default OrderPage;
