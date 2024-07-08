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
  color: ${props => props.theme.white};
  cursor: pointer;
  font-size:1rem;
  display: grid;
  grid-template-columns: repeat(1, 30% [col-start] 10% [col-middle] 15% [col-end]10%);
  padding-left: 5%;

`;

export const DropdownContent = styled.div`
  border: 1px solid ${props => props.theme.primary};
  padding: 1rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;
export const HeaderContent = styled.div`
    padding: 5px;
    align-self: center;
`;

export const OrderContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const OrderTitle = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 20px;
`;

export const OrderList = styled.ul`
    list-style: none;
    padding: 0;
`;

export const OrderItem = styled.li`
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-decoration: none;
    color: #007bff;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
        background-color: #f0f0f0;
    }
`;

export const PaginationNav = styled.nav`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

export const PaginationList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
`;

export const PaginationItem = styled.li`
    margin: 0 5px;
`;

export const PaginationLink = styled.button`
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    color: #007bff;
    cursor: pointer;

    &:hover {
        background-color: #007bff;
        color: #fff;
    }
`;

export const OrderDetailContainer = styled.div`
    width: 80%;
    margin: 20px auto;
    border: 1px solid #ddd;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

export const OrderDetailContent = styled.div`
    margin-bottom: 20px;
`;


export const OrderDetailHeader = styled.h1`
    margin: 5px 0;
    display:none;
`;

export const OrderDetailPara = styled.h2`
    margin: 5px 0;
`;
export const OrderDetailHeader2 = styled.h2`
    margin-bottom: 10px;
`;
export const OrderProductTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;
export const OrderProductThead = styled.thead`
  background-color: #f2f2f2;
`;

export const OrderProductTh = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
`;

export const OrderProductTd = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: right;

  &:first-child {
    text-align: left;
  }
`;