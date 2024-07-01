import styled from "styled-components";
import { Link } from 'react-router-dom';

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

export const StockButtonContainer = styled.div`
    width: 1000px;
    font-size: 1.2rem;
    display: flex;
    align-items: start;
`;

export const StockTable = styled.table`
    width: 90%;
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

export const StockUpdateContainer = styled.div`
  padding: 20px;
`;

export const StockUpdateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width:80%;
  margin: auto;
`;

export const StockUpdateInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  max-width: 400px;
`;

export const StockUpdateButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  width: 20%;
  margin: 20px auto;
`;


export const AddRowButton = styled.button`
    padding: 10px;
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 5px;
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
export const StockOrderContainer = styled.div`
    margin-top: 20px;
`;

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
export const AppPageContainer = styled.div`
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: ${props => props.theme.background};
`;

export const StyledLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

export const DropdownContainer = styled.div`
  width:90%;
  min-width: 1000px;
  margin-bottom: 1rem;
`;

export const DropdownHeader = styled.div`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 1rem;
  cursor: pointer;
  font-size:1.2rem;
`;

export const DropdownContent = styled.div`
  border: 1px solid ${props => props.theme.primary};
  padding: 1rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;