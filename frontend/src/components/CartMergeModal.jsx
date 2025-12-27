import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useCart } from "../contexts/CartContext";

export default function CartMergeModal() {
  const {
    showMergeModal,
    handleMergeCarts,
    handleKeepUserCart,
    closeMergeModal,     // ✅ PULLED FROM CONTEXT
    visitorCart,
    stockIssues,
  } = useCart();

  if (!showMergeModal) return null;

  return (
    <Modal show centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Merge carts?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
          You have items from a previous visit.
          Would you like to merge them with your account cart?
        </p>

        {/* Visitor cart preview */}
        {Array.isArray(visitorCart) && visitorCart.length > 0 ? (
          <ul className="list-group mb-3">
            {visitorCart.map((item) => (
              <li
                key={item.productId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="cart-product-title">
                  {item.title || item.productId}
                </span>
                <span className="fw-bold">{item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No guest items found.</p>
        )}

        {/* Stock warning */}
        {Array.isArray(stockIssues) && stockIssues.length > 0 && (
          <Alert variant="warning" className="mt-3">
            <Alert.Heading className="fs-6">
              Some items were limited by stock
            </Alert.Heading>

            <ul className="mb-0 ps-3">
              {stockIssues.map((issue) => (
                <li key={issue.productId}>
                  <strong>{issue.title || issue.productId}</strong>: requested{" "}
                  {issue.requested}, available {issue.available}
                </li>
              ))}
            </ul>

            <small className="text-muted d-block mt-2">
              Your cart was updated with the maximum available quantity.
            </small>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleKeepUserCart}>
          Keep my account cart
        </Button>

        <Button variant="primary" onClick={handleMergeCarts}>
          Merge carts
        </Button>

        <Button variant="outline-secondary" onClick={closeMergeModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}