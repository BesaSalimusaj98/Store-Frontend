// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirect to home or another page
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="card-title mb-4">Order Successful</h2>
        <div className="mb-3">
          <p className="lead">Thank you for your purchase!</p>
          <p>Your order has been successfully completed. You will receive a confirmation email shortly.</p>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
