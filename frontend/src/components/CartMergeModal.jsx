import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../contexts/CartContext";

export default function CartMergeModal() {
  const {
    showMergeModal,
    handleMergeCarts,
    handleKeepUserCart,
    visitorCart,
    stockIssues
  } = useCart();


  if (!Array.isArray(visitorCart)) return null;

  return (
    <Modal show={showMergeModal} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>Merge carts?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You have items from a previous visit.
          Would you like to merge them with your account cart?
        </p>

        {visitorCart.length > 0 ? (
          <ul className="list-group mb-3">
            {visitorCart.map((item) => (
              <li
                key={item.productId}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{item.title || item.productId}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No guest items found.</p>
        )}

        {stockIssues.length > 0 && (
          <>
            <hr />
            <p className="text-warning fw-bold">Stock limitations:</p>
            <ul>
              {stockIssues.map((i) => (
                <li key={i.productId}>
                  {i.productId}: requested {i.requested}, available {i.available}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleKeepUserCart}>
          Keep my account cart
        </Button>
        <Button variant="primary" onClick={handleMergeCarts}>
          Merge carts
        </Button>
      </Modal.Footer>
    </Modal>
  );
}