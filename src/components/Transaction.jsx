import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllTransactions } from "../services/Services";
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap CSS is imported

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await findAllTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleGoHome = () => {
    navigate("/");  // Redirect to the home page or adjust the route as needed
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-primary rounded-circle p-1"
          onClick={handleGoHome}
          style={{ position: "absolute", top: "10px", left: "10px", width: "40px", height: "40px" }}
        >
         &#8592;
        </button>
        <h2 className="ms-4">Transaction List</h2>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Client Name</th>
            <th>Barcode</th>
            <th>Sold Price</th>
            <th>Sold Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.user ? `${transaction.user.firstName} ${transaction.user.lastName}` : 'Unknown'}</td>
              <td>{transaction.barcode}</td>
              <td>${transaction.soldPrice}</td>
              <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
