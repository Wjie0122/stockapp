import React, { useState, useEffect } from 'react';
import {
    StockOrderRow,
    StockOrderLabel,
    StockOrderInput,
    StockOrderSelect,
    RemoveRowButton,
} from './StockRowStyles';
import { db } from '../../backend/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

const StockRow = ({ category, productName, productID, productQuantity, onQuantityChange, onRemove }) => {
    const [attributes, setAttributes] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [availableColors, setAvailableColors] = useState([]);

    useEffect(() => {
        const fetchAttributes = async (category) => {
            try {
                const docRef = doc(db, 'categories', category);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const attributesObj = docSnap.data().attributes; // Retrieve attributes
                    setAttributes(attributesObj); // Update state with attributes
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching attributes:', error);
            }
        };

        if (category) {
            fetchAttributes(category);
        }
    }, [category]);

    useEffect(() => {
        const fetchSizesForProduct = async (productID) => {
            try {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where('productID', '==', productID));
                const querySnapshot = await getDocs(q);

                let combinedSizes = [];
                let fetchedColors = [];

                querySnapshot.forEach((doc) => {
                    const productData = doc.data();
                    if (productData && productData.size) {
                        combinedSizes.push(productData.size);

                        // Fetch colors if available for the selected size
                        if (productData.color) {
                            fetchedColors.push(productData.color);
                        }
                    } else {
                        console.error('No size found for productID:', productID);
                    }
                });

                // Filter unique sizes
                const uniqueSizes = Array.from(new Set(combinedSizes));
                setAvailableSizes(uniqueSizes);
                setSelectedSize(uniqueSizes[0] || ''); // Select the first size by default

                // Filter unique colors
                const uniqueColors = Array.from(new Set(fetchedColors));
                setAvailableColors(uniqueColors);
                setSelectedColor(uniqueColors[0] || ''); // Select the first color by default
            } catch (error) {
                console.error('Error fetching sizes for product:', error);
            }
        };

        if (productID) {
            fetchSizesForProduct(productID);
        }
    }, [productID]);

    const handleSizeChange = (event) => {
        const newSize = event.target.value;
        setSelectedSize(newSize);
        setSelectedColor(''); // Reset selected color when size changes

        // Fetch colors for the selected size
        const fetchColorsForSize = async () => {
            try {
                const productsRef = collection(db, 'products');
                const q = query(productsRef, where('productID', '==', productID));
                const querySnapshot = await getDocs(q);

                let fetchedColors = [];

                querySnapshot.forEach((doc) => {
                    const productData = doc.data();
                    if (productData && productData.size === newSize && productData.colors) {
                        fetchedColors = [...fetchedColors, ...productData.colors[newSize]];
                    }
                });

                // Filter unique colors
                const uniqueColors = Array.from(new Set(fetchedColors));
                setAvailableColors(uniqueColors);
                setSelectedColor(uniqueColors[0] || ''); // Select the first color by default
            } catch (error) {
                console.error('Error fetching colors for size:', error);
            }
        };

        if (productID && newSize) {
            fetchColorsForSize();
        }
    };

    const handleColorChange = (event) => {
        const newColor = event.target.value;
        setSelectedColor(newColor);
    };

    const renderFields = () => {
        if (!attributes) {
            return <p>Loading attributes...</p>; // or render a loading indicator
        }
        const { color: hasColor, size: hasSize } = attributes;

        return (
            <>
                {hasSize && (
                    <>
                        <StockOrderLabel>Size</StockOrderLabel>
                        <StockOrderSelect value={selectedSize} onChange={handleSizeChange}>
                            {availableSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </StockOrderSelect>
                    </>
                )}
                {hasColor && hasSize && (
                    <>
                        <StockOrderLabel>Color</StockOrderLabel>
                        <StockOrderSelect value={selectedColor} onChange={handleColorChange}>
                            <option value="">Select Color</option>
                            {availableColors.map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </StockOrderSelect>
                    </>
                )}
                <StockOrderLabel>Quantity</StockOrderLabel>
                <StockOrderInput
                    type="number"
                    value={productQuantity}
                    onChange={onQuantityChange}
                    required
                    placeholder="1,2,3,..."
                    min="1"
                />
            </>
        );
    };

    return (
        <StockOrderRow>
            <StockOrderLabel>Product</StockOrderLabel>
            <StockOrderInput type="text" value={productName} readOnly disabled />
            <StockOrderInput type="text" value={productID} readOnly hidden />
            {renderFields()}
            <RemoveRowButton type="button" onClick={onRemove}>
                Remove
            </RemoveRowButton>
        </StockOrderRow>
    );
};

export default StockRow;
