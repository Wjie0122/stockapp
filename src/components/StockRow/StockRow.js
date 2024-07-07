import React, { useState, useEffect } from 'react';
import {
    StockOrderRow,
    StockOrderLabel,
    StockOrderInput,
    RemoveRowButton,
} from './StockRowStyles';

const StockRow = ({ productName, productID, productQuantity, onQuantityChange, onRemove }) => {
    return (
        <StockOrderRow>
            <StockOrderLabel>Product</StockOrderLabel>
            <StockOrderInput type="text" value={productName} readOnly disabled />
            <StockOrderInput type="text" value={productID} readOnly hidden />
            <StockOrderLabel>Quantity</StockOrderLabel>
            <StockOrderInput
                type="number"
                value={productQuantity}
                onChange={onQuantityChange}
                required
                placeholder="1,2,3,..."
                min="1"
            />
            <RemoveRowButton type="button" onClick={onRemove}>
                Remove
            </RemoveRowButton>
        </StockOrderRow>
    );
};

export default StockRow;
