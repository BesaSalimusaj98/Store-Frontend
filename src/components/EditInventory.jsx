/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { findAllSizes, createInventory, updateInventory } from "../services/Services";

const EditInventory = () => {
  const location = useLocation();
  const state = location.state?.addPage;
  const { id } = useParams();
  const navigate = useNavigate();
  const initialItem = location.state?.item || {};
  const isAddPage = location.state?.addPage;
  const [item, setItem] = useState(initialItem);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({}); // To store validation errors

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAllSizes = () => {
    findAllSizes()
      .then((response) => setSizes(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllSizes();
  }, []);

  const handleSizeChange = (e) => {
    const selectedSize = sizes.find((size) => size.name === e.target.value);
    setItem((prevState) => ({
      ...prevState,
      size: selectedSize,
      // Set sold_date and sold_price to null if size is '1'
      sold_date: selectedSize?.state === 1 ? null : prevState.sold_date,
      sold_price: selectedSize?.state === 1 ? null : prevState.sold_price,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the changed input is sold_date, ensure it's formatted correctly
    const newValue = name === 'sold_date' ? formatDate(value) : value;
    setItem((prevState) => ({
      ...prevState,
      [name]: newValue,

    }));
  };
  

  const validateForm = () => {
    const newErrors = {};
    if (item.state === 2) {
      if (!item.size) newErrors.size = "Size is required.";
      if (!item.sold_date) newErrors.sold_date = "Sold date is required.";
      if (!item.sold_price) newErrors.sold_price = "Sold price is required.";
      if (isNaN(item.sold_price) || item.sold_price <= 0)
        newErrors.sold_price = "Sold price must be a positive number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {

    
      // Ensure that sold_date and sold_price are set to null when state is '1'
      const submittedItem = { 
        ...item, 
        //state: item.state || (isAddPage ? "1" : ""), // Ensure state is included
        sold_date:item.state === '1' ? null : formatDate(item.sold_date),
        sold_price: item.state === '1' ? null : item.sold_price
      };

      if (isAddPage) {
        // Call createInventory API if it's the add page
        createInventory(id, submittedItem)
          .then(response => {
            navigate(`/inventory/${id}`); // Navigate to the product details page after successful creation
          })
          .catch(error => console.log(error));
      } else {
        // Logic for updating an existing inventory item would go here
         updateInventory(id, submittedItem)
          .then(response => {
            navigate(`/inventory/edit/${id}`)
          })
      }
    }
  };

  return (
    <div className="container">
      <h1>
        {isAddPage ? "Add New Product Inventory" : "Edit Product Inventory"}
      </h1>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={item.productId || ""} />
        {!isAddPage && (
          <div className="form-group mb-2">
            <label htmlFor="barcode">Barcode</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={item.barcode || ""}
              className={`form-control`}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="form-group mb-2">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={isAddPage ? "1" : item.state || ""}
            onChange={handleChange}
            disabled={isAddPage} // Disable the input if it's the add page
            className={`form-control`}
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="size">Size</label>
          <select
            id="size"
            name="size"
            className={`form-control`}
            value={item.size?.name || ""}
            onChange={handleSizeChange}
          >
            <option value="">Select a size</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.name}>
                {size.name}
              </option>
            ))}
          </select>
          {errors.size && <div className="text-danger">{errors.size}</div>}
        </div>
        {!isAddPage && (
          <>
            <div className="form-group mb-2">
              <label htmlFor="sold_date">
                Sold Date
                {item.state === "2" && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type="date"
                id="sold_date"
                name="sold_date"
                value={
                  item.state === "1" ? "" : formatDate(item.sold_date) || ""
                }
                onChange={handleChange}
                className={`form-control`}
                disabled={item.state === 1} // Disable input if size is '1'
              />
              {errors.sold_date && (
                <div className="text-danger">{errors.sold_date}</div>
              )}
            </div>
            <div className="form-group mb-2">
              <label htmlFor="sold_price">
                Sold Price
                {item.state === "2" && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type="number"
                step="0.01"
                id="sold_price"
                name="sold_price"
                value={item.state === "1" ? "" : item.sold_price || ""} // Clear value when state is '1'
                onChange={handleChange}
                className={`form-control`}
                disabled={item.state === 1} // Disable input if state is '1'
              />
              {errors.sold_price && (
                <div className="text-danger">{errors.sold_price}</div>
              )}
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditInventory;
