import styled from "styled-components";

export const StockOrderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;

export const StockOrderInput = styled.input`
    padding: 10px;
    font-size: 1rem;
`;

export const StockOrderLabel = styled.label`
    font-size: 1rem;
`;

export const StockOrderSelect = styled.select`
    padding: 10px;
    font-size: 1rem;
`;
export const RemoveRowButton = styled.button`
    padding: 10px;
    background-color: #ff6347; /* Indian Red */
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 5px;
`;