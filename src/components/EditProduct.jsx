/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, createProduct } from '../services/Services';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState({
        name: '',
        description: '',
        cost: 0,
        price: 0,
        commission: 0,
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        cost: '',
        price: '',
        commission: '',
    });

    useEffect(() => {
        if (id) {
            getProduct(id)
                .then((response) => {
                    setProduct(response.data);
                })
                .catch((error) => {
                    console.error('There was an error fetching the product!', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!product.name.trim()) {
            errorsCopy.name = 'Name is required';
            valid = false;
        } else {
            errorsCopy.name = '';
        }

        if (!product.description.trim()) {
            errorsCopy.description = 'Description is required';
            valid = false;
        } else {
            errorsCopy.description = '';
        }

        if (product.cost <= 0) {
            errorsCopy.cost = 'Cost must be greater than 0';
            valid = false;
        } else {
            errorsCopy.cost = '';
        }

        if (product.price <= 0) {
            errorsCopy.price = 'Price must be greater than 0';
            valid = false;
        } else {
            errorsCopy.price = '';
        }

        if (product.commission < 0) {
            errorsCopy.commission = 'Commission cannot be negative';
            valid = false;
        } else {
            errorsCopy.commission = '';
        }

        setErrors(errorsCopy);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (id) {
                updateProduct(id, product)
                    .then(() => {
                        navigate('/products');
                    })
                    .catch((error) => {
                        console.error('There was an error updating the product!', error);
                    });
            } else {
                createProduct(product)
                    .then(() => {
                        navigate('/products');
                    })
                    .catch((error) => {
                        console.error('There was an error creating the product!', error);
                    });
            }
        }
    };

    return (
        <div className="container">
            <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={product.id || ''} />
                <div className="form-group mb-2">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="cost">Cost</label>
                    <input
                        type="number"
                        step="0.01"
                        id="cost"
                        name="cost"
                        value={product.cost}
                        onChange={handleChange}
                        className={`form-control ${errors.cost ? 'is-invalid' : ''}`}
                    />
                    {errors.cost && <div className="invalid-feedback">{errors.cost}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="commission">Commission</label>
                    <input
                        type="number"
                        step="0.01"
                        id="commission"
                        name="commission"
                        value={product.commission}
                        onChange={handleChange}
                        className={`form-control ${errors.commission ? 'is-invalid' : ''}`}
                    />
                    {errors.commission && <div className="invalid-feedback">{errors.commission}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;
