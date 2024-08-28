/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateInventoryAndSaveTransaction } from "../services/Services";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the state object
  const { product, size, quantity, totalPrice, user } = location.state || {};

  const handleCancel = () => {
    navigate("/products"); // Navigate back to the catalog page
  };
console.log("useri:", user)
  const handleCheckout = async () => {
    try {
      const response = await updateInventoryAndSaveTransaction({
        productId: product.product.id,
        sizeId: size.id,
        quantity,
        totalPrice,
        date: new Date().toISOString().split('T')[0], // Format date as yyyy-MM-dd
        userId: user
      });
      
      if (response.status === 200) {
        alert('Transaction completed successfully!');
        navigate('/success'); // Redirect to a success page or order summary
      } else {
        alert('Failed to complete the transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      alert('An error occurred while processing your request.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="card-title mb-4">Checkout</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Product:</strong> {product.product.name}
            </p>
            <p>
              <strong>Size:</strong> {size.name}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Quantity:</strong> {quantity}
            </p>
            <p>
              <strong>Total Price:</strong> ${totalPrice}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
