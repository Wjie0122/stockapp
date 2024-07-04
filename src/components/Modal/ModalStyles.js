import styled from "styled-components";

export const ModalContainer = styled.dialog`
  border-radius: 1rem;
  width: 23rem;
  min-height: 10rem;
  border: none;
  display: ${(props) => (props.display ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  padding: 2rem;
`;

export const ModalTitle = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
`;
export const ModalContent = styled.div`
  width: 90%;
  text-align: center;
`;

export const ModalButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const EmptyModalContainer = styled.dialog`
  display: ${(props) => (props.display ? "" : "none")};
  border-radius: 1rem;
  border: none;
  // min-height: 10rem;
  // min-width: 10rem;
  padding: 1rem;
`;
export const EmptyModalCloseContainer = styled.div`
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  display: ${(props) => (props.display ? "flex" : "none")};
`;

export const CategoryInput = styled.input`
  padding: 10px;
    font-size: 1rem;
    margin: 10px;
`;

export const CategorySelect = styled.select`
  padding: 10px;
    font-size: 1rem;
    margin: 10px;
`;
export const CategoryOption = styled.option`
`;

export const Checkbox = styled.div`
     text-align: left; 
     padding: 5px 0 0 55px;
`;
export const CheckboxLabel = styled.label`
`;
