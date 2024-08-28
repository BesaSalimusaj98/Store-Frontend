/* eslint-disable no-unused-vars */
import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api';

// Product functions
export const listProducts = () => axios.get(`${REST_API_BASE_URL}/products`);
export const createProduct = (product) => axios.post(`${REST_API_BASE_URL}/products`, product);
export const getProduct = (productId) => axios.get(`${REST_API_BASE_URL}/products/${productId}`);
export const updateProduct = (productId, product) => axios.put(`${REST_API_BASE_URL}/products/${productId}`, product);
export const deleteProduct = (productId) => axios.delete(`${REST_API_BASE_URL}/products/${productId}`);

// Inventory functionsa
export const getInventoryByProductId = (productId) => axios.get(`${REST_API_BASE_URL}/inventory/${productId}`);
export const createInventory = (productId, inventoryDto) => axios.post(`${REST_API_BASE_URL}/inventory/${productId}`, inventoryDto, {
  headers: {
    'Content-Type': 'application/json'
  }
});
export const updateInventory = (productId, inventory) => axios.put(`${REST_API_BASE_URL}/inventory/${productId}`, inventory);
// Inventory functions
export const checkAvailability = (productId, sizeId, quantity) => axios.get(`${REST_API_BASE_URL}/inventory/check-availability`, { params: { productId, sizeId, quantity }},{ 
  headers: {
    'Content-Type': 'application/json'
  }}
);

// Inventory functions
export const updateInventoryAndSaveTransaction = (params) => axios.put(`${REST_API_BASE_URL}/inventory/update`, null, {
  params: params,
  headers: {
    'Content-Type': 'application/json'
  }
});
export const deleteInventory = (barcode) => axios.delete(`${REST_API_BASE_URL}/inventory/delete-by-barcode`, {
  params: { barcode }
});
// User functions
export const loginUser = (loginDto) => axios.post(`${REST_API_BASE_URL}/user/login`, loginDto, {
  headers: {
    'Content-Type': 'application/json'
  }
});

// Size functions
export const findAllSizes = () => axios.get(`${REST_API_BASE_URL}/sizes`);

// Transaction functions
export const findAllTransactions = () => axios.get(`${REST_API_BASE_URL}/transactions`);
