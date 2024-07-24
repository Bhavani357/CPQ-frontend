import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Auth/Signup';
import Signin from './Pages/Auth/Signin';
import Proposals from './Pages/Proposals/Proposals';
import CpqLayout from './Pages/CpqLayout/CpqLayout';
import Customers from './Pages/Customers/Customers';
import Subscriptions from './Pages/Subscriptions/Subscriptions';
import Invoices from './Pages/Invoices/Invoices';
import Products from './Pages/Products/Products';
import AddCustomer from './Pages/Customers/AddCustomer';
import ProtectedRouting from './Pages/ProtectedRouting';
import AddProduct from './Pages/Products/AddProduct';
import CreateProposal from './Pages/Proposals/CreateProposal';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<ProtectedRouting />}>
            <Route path="/" element={<CpqLayout />}>
              <Route index element={<Proposals />} />
              <Route path="proposals" index element={<Proposals />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="products" element={<Products />}>
                <Route path="addProduct" element={<AddProduct />} />
              </Route>
              <Route path="customers" element={<Customers />}>
                <Route path="addCustomer" element={<AddCustomer />} />
              </Route>
            </Route>
            <Route path="proposals/:id" element={<CreateProposal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
