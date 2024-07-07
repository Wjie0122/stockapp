import { useState, useRef, useEffect } from "react";
import {
  EmptyModalCloseContainer,
  EmptyModalContainer,
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalTitle,
  CategoryInput,
  CategoryOption,
  CategorySelect,
  Checkbox,
  CheckboxLabel
} from "./ModalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../../theme";
import Button from "../Button/Button";
import { IoMdClose } from "react-icons/io";

//Props:
{
  /* <Modal
handleModalClose={() => {
  setShowModal(false);
}}
modalType="action"
actionButtonText="Delete"
actionButtonColor={theme.statusError}
actionButtonClick={() => {}}
show={showModal}
modalTitle="Delete User"
modalContent="Are you sure you want to delete this user? This action cannot be undone."
/> */
}

//Exmaple of empty modal with custom content:
{
  /* <Modal
  show={showModal}
  handleModalClose={() => {
    setShowModal(false);
  }}
  modalType="empty"
  showCross={true}
>
  <div style={{ width: "20rem", background: "red", height: "20rem" }}>
    content goes here
  </div>
</Modal>; */
}

//Usage:
//1. In the parent element just send a boolean prop (true/false), true will open the modal, false will close it.

const Modal = (props) => {
  const modalRef = useRef(null);
  const modalType = props.modalType;

  const showModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      props.handleModalClose();
    }
  };

  useEffect(() => {
    if (props.show) {
      showModal();
    } else {
      closeModal();
    }
  }, [props.show]);

  const getModalType = () => {
    switch (modalType) {
      case "empty":
        return (
          <EmptyModalContainer ref={modalRef} display={props.show}>
            <EmptyModalCloseContainer display={props.showCross}>
              <IoMdClose
                size="1.8rem"
                onClick={() => {
                  closeModal();
                }}
                style={{ cursor: "pointer" }}
              />
            </EmptyModalCloseContainer>
            {props.children}
          </EmptyModalContainer>
        );
      case "action":
        return (
          <ModalContainer display={props.show} ref={modalRef}>
            <ModalTitle>{props.modalTitle}</ModalTitle>
            <ModalContent>{props.modalContent}</ModalContent>
            <ModalButtonContainer>
              <Button
                filled={true}
                filledColor={props.actionButtonColor}
                defaultColor={props.actionButtonColor}
                onClick={() => {
                  closeModal();
                  props.actionButtonClick();
                }}
              >
                {props.actionButtonText ? props.actionButtonText : "OK"}
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                }}
              >
                {props.closingButtonText ? props.closingButtonText : "Cancel"}
              </Button>
            </ModalButtonContainer>
          </ModalContainer>
        );
        case "addCategory":
          return (
            <ModalContainer display={props.show} ref={modalRef}>
              <ModalTitle>{props.modalTitle}</ModalTitle>
              <ModalContent>
                {props.modalContent}
                <CategoryInput
                  type="text"
                  value={props.inputValue}
                  onChange={(e) => props.setInputValue(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
                  <br/>Has different Color/Size ?
                <CategorySelect
                value={props.attributes}
                onChange={(e) =>
                  props.setAttributes(e.target.value)
                }
                required
              >
                <CategoryOption value="">Select Color/Size Attributes</CategoryOption>
                <CategoryOption value="true">Yes</CategoryOption>
                <CategoryOption value="false">No</CategoryOption>
              </CategorySelect>
              </ModalContent>
              <ModalButtonContainer>
                <Button
                  filled={true}
                  filledColor={props.actionButtonColor}
                  defaultColor={props.actionButtonColor}
                  onClick={() => {
                    closeModal();
                    props.actionButtonClick(props.inputValue, props.attributes);
                  }}
                >
                  {props.actionButtonText ? props.actionButtonText : "OK"}
                </Button>
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                >
                  {props.closingButtonText ? props.closingButtonText : "Cancel"}
                </Button>
              </ModalButtonContainer>
            </ModalContainer>
          );
          case "editCategory":
          return (
            <ModalContainer display={props.show} ref={modalRef}>
              <ModalTitle>{props.modalTitle}</ModalTitle>
              <ModalContent>
                {props.modalContent}
                <CategoryInput
                  type="text"
                  value={props.inputValue}
                  onChange={(e) => props.setInputValue(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
                  <br/>Has different Color/Size ?
                <CategorySelect
                value={props.attributes}
                onChange={(e) =>
                  props.setAttributes(e.target.value)
                }
                required
              >
                <CategoryOption value="" hidden>Select Color/Size Attributes</CategoryOption>
                <CategoryOption value="true">Yes</CategoryOption>
                <CategoryOption value="false">No</CategoryOption>
              </CategorySelect>
              </ModalContent>
              <ModalButtonContainer>
                <Button
                  filled={true}
                  filledColor={props.actionButtonColor}
                  defaultColor={props.actionButtonColor}
                  onClick={() => {
                    closeModal();
                    props.actionButtonClick(props.inputValue, props.attributes);
                  }}
                >
                  {props.actionButtonText ? props.actionButtonText : "OK"}
                </Button>
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                >
                  {props.closingButtonText ? props.closingButtonText : "Cancel"}
                </Button>
              </ModalButtonContainer>
            </ModalContainer>
          );
          case "addProduct":
              return (
                <ModalContainer display={props.show} ref={modalRef}>
                  <ModalTitle>{props.modalTitle}</ModalTitle>
                  <ModalContent>
                    <CategoryInput
                      type="text"
                      value={props.productID}
                      onChange={(e) => props.setProductID(e.target.value)}
                      placeholder="Enter Product Code"
                      required
                    />
                    <CategoryInput
                      type="text"
                      value={props.productName}
                      onChange={(e) => props.setProductName(e.target.value)}
                      placeholder="Enter Product Name"
                      required
                    />
                    <CategoryInput
                      type="number"
                      value={props.productPrice}
                      onChange={(e) => props.setProductPrice(e.target.value)}
                      placeholder="Enter Product Price"
                      min="0"
                      required
                    />
                    <CategoryInput
                      type="number"
                      value={props.pv}
                      onChange={(e) => props.setPv(e.target.value)}
                      placeholder="Enter PV"
                      required
                      min="0"
                    />
                  </ModalContent>
                  <ModalButtonContainer>
                    <Button
                      filled={true}
                      filledColor={props.actionButtonColor}
                      defaultColor={props.actionButtonColor}
                      onClick={() => {
                        closeModal();
                        props.actionButtonClick(props.productID, props.productName, props.productPrice, props.pv);
                      }}
                    >
                      {props.actionButtonText ? props.actionButtonText : "OK"}
                    </Button>
                    <Button
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      {props.closingButtonText ? props.closingButtonText : "Cancel"}
                    </Button>
                  </ModalButtonContainer>
                </ModalContainer>
              );
          case "addProductType":
              return (
                <ModalContainer display={props.show} ref={modalRef}>
                  <ModalTitle>{props.modalTitle}</ModalTitle>
                  <ModalContent>
                    <CategoryInput
                      type="text"
                      value={props.productID}
                      onChange={(e) => props.setProductID(e.target.value)}
                      placeholder="Enter Product Code"
                      required
                    />
                    <CategoryInput
                      type="text"
                      value={props.productName}
                      onChange={(e) => props.setProductName(e.target.value)}
                      placeholder="Enter Product Name"
                      required
                    />
                    <Checkbox>
                      Please tick if has different color.<br/>
                      <CheckboxLabel>
                        <CategoryInput
                          type="checkbox"
                          checked={props.hasColor}
                          onChange={(e) => props.setHasColor(e.target.checked)}
                        />
                        Color
                      </CheckboxLabel>
                    </Checkbox>
                    <Checkbox>
                      Please tick if has different size.<br/>
                      <CheckboxLabel>
                        <CategoryInput
                          type="checkbox"
                          checked={props.hasSize}
                          onChange={(e) => props.setHasSize(e.target.checked)}
                        />
                        Size
                      </CheckboxLabel>
                    </Checkbox>
                  </ModalContent>
                  <ModalButtonContainer>
                    <Button
                      filled={true}
                      filledColor={props.actionButtonColor}
                      defaultColor={props.actionButtonColor}
                      onClick={() => {
                        closeModal();
                        props.actionButtonClick(props.productID, props.productName);
                      }}
                    >
                      {props.actionButtonText ? props.actionButtonText : "OK"}
                    </Button>
                    <Button
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      {props.closingButtonText ? props.closingButtonText : "Cancel"}
                    </Button>
                  </ModalButtonContainer>
                </ModalContainer>
              );

              case "addItem":
                return (
                  <ModalContainer display={props.show} ref={modalRef}>
                    <ModalTitle>{props.modalTitle}</ModalTitle>
                    <ModalContent>
                      <CategoryInput
                        type="text"
                        value={props.productID}
                        disabled
                      />
                      <CategoryInput
                        type="text"
                        value={props.productName}
                        disabled
                      />
                      <CategoryInput
                        type="number"
                        value={props.productPrice}
                        onChange={(e) => props.setProductPrice(e.target.value)}
                        placeholder="Enter Product Price"
                        min="0"
                        required
                      />
                      <CategoryInput
                        type="number"
                        value={props.pv}
                        onChange={(e) => props.setPv(e.target.value)}
                        placeholder="Enter PV"
                        required
                        min="0"
                      />
                      <CategoryInput
                        type="text"
                        value={props.color}
                        onChange={(e) => props.setColor(e.target.value)}
                        placeholder="Enter Product Color/NA"
                      />
                      <CategoryInput
                        type="text"
                        value={props.size}
                        onChange={(e) => props.setSize(e.target.value)}
                        placeholder="Enter Product Size/NA"
                        required
                      />
                    </ModalContent>
                    <ModalButtonContainer>
                      <Button
                        filled={true}
                        filledColor={props.actionButtonColor}
                        defaultColor={props.actionButtonColor}
                        onClick={() => {
                          closeModal();
                          props.actionButtonClick(props.productID, props.productName, props.productPrice, props.pv);
                        }}
                      >
                        {props.actionButtonText ? props.actionButtonText : "OK"}
                      </Button>
                      <Button
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        {props.closingButtonText ? props.closingButtonText : "Cancel"}
                      </Button>
                    </ModalButtonContainer>
                  </ModalContainer>
                );
      default:
        return (
          <ModalContainer display={props.show} ref={modalRef}>
            <ModalTitle>{props.modalTitle}</ModalTitle>
            <ModalContent>{props.modalContent}</ModalContent>
            <ModalButtonContainer>
              <Button
                filled={false}
                filledColor={props.actionButtonColor}
                defaultColor={props.actionButtonColor}
                onClick={() => {
                  closeModal();
                }}
              >
                {props.closingButtonText ? props.closingButtonText : "OK"}
              </Button>
            </ModalButtonContainer>
          </ModalContainer>
        );
    }
  };

  return <ThemeProvider theme={theme}>{getModalType()}</ThemeProvider>;
};

export default Modal;
