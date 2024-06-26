import styled from "styled-components";

export const StockPageContainer = styled.div`
    width: 95%;
    margin: 5px auto;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const PageTitle = styled.div`
    width: 100%;
    font-size: 3rem;
    font-weight: 600;
    margin: 10px 0;
    text-align: center;
    color: #333;
`;

export const StockContainer = styled.div`
    margin: 10px 40px;
    font-size: 2rem;
    width:100%;
`;

export const StockTable = styled.table`
    width: 80%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 1.2rem;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

export const StockTableRow = styled.tr`
    background-color: #f3f3f3;
    color: #333;
    text-align: left;

    &:nth-of-type(even) {
        background-color: #f3f3f3;
    }

    &:hover {
        background-color: #f1f1f1;
    }
`;

export const StockTableHeader = styled.th`
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-weight: bold;
    color: #2c3e50;
`;

export const StockTableData = styled.td`
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;

    &:first-of-type {
        font-weight: bold;
        color: #2c3e50;
    }
`;
