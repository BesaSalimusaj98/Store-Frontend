/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProductsComponent from './components/ProductsComponent';
import EditProduct from './components/EditProduct';
import InventoryComponent from './components/InventoryComponent';
import EditInventory from './components/EditInventory';
import Checkout from './components/Checkout';
import SuccessPage from './components/Success';
import Transaction from './components/Transaction';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <ProductsComponent user={user} /> : <Login setUser={setUser} />} />
        <Route path="/products" element={user ? <ProductsComponent user={user} /> : <Login setUser={setUser} />} />
        <Route path="/inventory/:productId" element={user ? <InventoryComponent user={user} /> : <Login setUser={setUser} />}/>
        <Route path="/inventory/edit/:id" element={user ? <EditInventory user={user} /> : <Login setUser={setUser} />}/>
        <Route path="/inventory/add/:id" element={user ? <EditInventory user={user} /> : <Login setUser={setUser} />}/>
        <Route path="/add" element={user ? <EditProduct user={user} /> : <Login setUser={setUser} />} />
        <Route path="/edit/:id" element={user ? <EditProduct user={user} /> : <Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/checkout" element={<Checkout/>}></Route>
        <Route path="/success" element= {<SuccessPage/>}/>
        <Route path='/transaction' element={<Transaction/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
