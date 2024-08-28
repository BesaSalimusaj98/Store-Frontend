/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  deleteProduct,
  listProducts,
  checkAvailability,
} from "../services/Services";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductsComponent = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortingOrder, setSortingOrder] = useState({
    productName: null,
    cost: "asc", // Initial sorting by 'cost' in ascending order
    price: null,
    commission: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [quantities, setQuantities] = useState({});
  const [isOrderEnabled, setIsOrderEnabled] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [sizeSurcharge, setSizeSurcharge] = useState("");
  const navigate = useNavigate();
  // eslint-disable-next-line react/prop-types
  const userRole = user ? (user.role === 2 ? "USER" : "ADMIN") : "GUEST"; // Set role based on user data
  useEffect(() => {
    getAllProducts();
    checkLoginStatus();
  }, []);
  
  useEffect(() => {
    const filterProducts = products.filter(
      (product) =>
        product.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filterProducts].sort((a, b) => {
      if (sortingOrder.productName) {
        return sortingOrder.productName === "asc"
          ? a.product.name.localeCompare(b.product.name)
          : b.product.name.localeCompare(a.product.name);
      } else if (sortingOrder.cost) {
        return sortingOrder.cost === "asc"
          ? parseFloat(a.product.cost) - parseFloat(b.product.cost)
          : parseFloat(b.product.cost) - parseFloat(a.product.cost);
      } else if (sortingOrder.price) {
        return sortingOrder.price === "asc"
          ? parseFloat(a.product.price) - parseFloat(b.product.price)
          : parseFloat(b.product.price) - parseFloat(a.product.price);
      } else if (sortingOrder.commission) {
        return sortingOrder.commission === "asc"
          ? parseFloat(a.product.commission) - parseFloat(b.product.commission)
          : parseFloat(b.product.commission) - parseFloat(a.product.commission);
      }
      // Add other sorting logic if needed
      return 0;
    });

    const paginatedProducts = sortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setFilteredProducts(paginatedProducts);
  }, [products, searchTerm, sortingOrder, currentPage, itemsPerPage]);


  function getAllProducts() {
    listProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const sortData = (column) => {
    let newOrder = sortingOrder[column] === "asc" ? "desc" : "asc";

    setSortingOrder({
      productName: null,
      cost: null,
      price: null,
      commission: null,
      [column]: newOrder,
    });
  };

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);

  function handleEdit(id) {
    navigate(`/edit/${id}`);
  }

  function addNewProduct() {
    navigate("/add");
  }

  function handleTransaction() {
    navigate("/transaction");
  }

  function removeProduct(id) {
    deleteProduct(id)
      .then((response) => {
        getAllProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // New function to navigate to inventory page
  function viewInventory(productId) {
    navigate(`/inventory/${productId}`);
  }

  function handleSizeChange(productId, size) {
    setSelectedSize((prevState) => ({
      ...prevState,
      [productId]: size,
    }));
  }

  function handleQuantityChange(productId, value) {
    if (/^\d*$/.test(value)) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: value,
      }));

      const sizeId = selectedSize[productId]; // Ensure size is selected
      if (sizeId) {
        checkAvailability(productId, sizeId, value)
          .then((response) => {
            const { isAvailable } = response.data;
            const {availableQuantity} = response.data;
            setSizeSurcharge(response.data.sizeSurcharge);
            setIsOrderEnabled((prevState) => ({
              ...prevState,
              [productId]: isAvailable,
            }));

            if (!response.data.available) {
              alert('The product is all sold out for the size you have chosen.');
              window.location.reload(); // Reload the page
          } 
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }

  function handleOrder(productId) {
    const productQuantity = quantities[productId];
    const productSize = selectedSize[productId];
    const product = products.find((p) => p.product.id === productId);
    const size = product.sizes.find((s) => s.name === productSize);

    if (productQuantity > 0 && productSize) {
      const totalPrice =
        productQuantity *
        (product.product.price + size.surcharge + product.product.commission);
      navigate("/checkout", {
        state: {
          // eslint-disable-next-line react/prop-types
          user: user.id,
          product: product,
          size: size,
          quantity: productQuantity,
          totalPrice: totalPrice,
        },
      });
    }
  }
  return (
    <div className="container">
      <h2 className="text-center">List of Products</h2>
      {isLoggedIn ? (
        <>{userRole === "ADMIN" &&
          (<button className="btn btn-primary mb-2 me-2" onClick={addNewProduct}>
            Add Product
          </button>)
        }
          {userRole === "ADMIN" && (
            <button
              className="btn btn-primary mb-2 me-2"
              onClick={handleTransaction}
            >
              Transaction
            </button>
          )}
          <br />
          <button
            className="btn btn-secondary mb-2"
            onClick={() => {
              localStorage.removeItem("user");
              setIsLoggedIn(false);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <button className="btn btn-primary mb-2" onClick={handleLogin}>
          Login
        </button>
      )}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3"
      />
      <table className="table table-striped table-border">
        <thead>
          <tr>
            <th>Product Id</th>
            <th onClick={() => sortData("productName")} style={{ cursor: "pointer" }}>
              Product Name{" "}
              {sortingOrder.productName === "asc"
                ? "↑"
                : sortingOrder.productName === "desc"
                  ? "↓"
                  : ""}
            </th>
            <th>Description</th>
            <th onClick={() => sortData("cost")} style={{ cursor: "pointer" }}>
              Cost{" "}
              {sortingOrder.cost === "asc"
                ? "↑"
                : sortingOrder.cost === "desc"
                  ? "↓"
                  : ""}
            </th>
            <th onClick={() => sortData("price")} style={{ cursor: "pointer" }}>
              Price{" "}
              {sortingOrder.price === "asc"
                ? "↑"
                : sortingOrder.price === "desc"
                  ? "↓"
                  : ""}
            </th>
            <th onClick={() => sortData("commission")} style={{ cursor: "pointer" }}>
              Commission{" "}
              {sortingOrder.commission === "asc"
                ? "↑"
                : sortingOrder.commission === "desc"
                  ? "↓"
                  : ""}
            </th>
            <th>Size</th>
            {userRole === "USER" && <th>Quantity</th>}
            {userRole === "USER" && <th>Order</th>}
            {userRole === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const uniqueSizes = new Set(
                product.sizes.map((size) => size.name)
              );
              return (
                <tr key={product.product.id}>
                  {userRole === "ADMIN" ? (
                    <td>
                      <a
                        href="#"
                        onClick={() => viewInventory(product.product.id)}
                      >
                        {product.product.name}
                      </a>
                    </td>
                  ) : (
                    <td>{product.product.id}</td>
                  )}
                  <td>{product.product.name}</td>
                  <td>{product.product.description}</td>
                  <td>{product.product.cost}</td>
                  <td>{product.product.price}</td>
                  <td>{product.product.commission}</td>
                  {userRole === "USER" ? (
                    <td>
                      <select
                        className="form-control"
                        value={selectedSize[product.product.id] || ""}
                        onChange={(e) =>
                          handleSizeChange(product.product.id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select size
                        </option>
                        {[...uniqueSizes].map((sizeName) => (
                          <option key={sizeName} value={sizeName}>
                            {sizeName}
                          </option>
                        ))}
                      </select>
                    </td>
                  ) : (
                    <td>
                      {[...uniqueSizes].map((sizeName) => (
                        <div key={sizeName}>{sizeName}</div>
                      ))}
                    </td>
                  )}
                  {userRole === "USER" && (
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={quantities[product.product.id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.product.id,
                            e.target.value
                          )
                        }
                        min="1"
                      />
                    </td>
                  )}
                  {userRole === "USER" && (
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleOrder(product.product.id)}
                        disabled={!isOrderEnabled[product.product.id]}
                      >
                        Order
                      </button>
                    </td>
                  )}
                  {userRole === "ADMIN" && (
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          handleEdit(product.product.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          removeProduct(product.product.id);
                        }}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductsComponent;
