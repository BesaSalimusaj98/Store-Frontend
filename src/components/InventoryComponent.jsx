/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getInventoryByProductId, deleteInventory } from "../services/Services";
import { useParams, useNavigate } from "react-router-dom";

const InventoryComponent = () => {
  const { productId } = useParams();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getInventoryByProductId(productId);
        setInventory(response.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [productId]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleGoHome = () => {
    navigate("/");  // Redirect to the home page or adjust the route as needed
  };

  const handleDelete = async (barcode) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await deleteInventory(barcode);
        setInventory((prevInventory) =>
          prevInventory.filter((item) => item.barcode !== barcode)
        );
        alert('Inventory item deleted successfully');
      } catch (err) {
        console.error('Error deleting inventory item:', err);
        alert('Failed to delete inventory item');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", gap: "20%" }}>
        <button
          className="btn btn-primary rounded-circle p-1"
          onClick={handleGoHome}
          style={{ width: "40px", height: "40px" }}
        >
          &#8592;
        </button>
        <h2 className="text-center">Inventory for Product ID: {productId}</h2>
      </div>
      <br></br>
      <button
        className="btn btn-primary mb-2"
        onClick={() =>
          navigate(`/inventory/add/${productId}`, {
            state: {
              addPage: true,
            },
          })
        }
      >
        Add New Inventory
      </button>
      <table className="table table-striped table-border">
        <thead>
          <tr>
            <th>Barcode</th>
            <th>State</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <tr key={item.barcode}>
                <td>{item.barcode}</td>
                <td>{item.state}</td>
                <td>{item.size.name}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      // Navigate with the updated item object
                      navigate(`/inventory/edit/${productId}`, {
                        state: { item: item },
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(item.barcode)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No inventory data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryComponent;
