import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderList from './Markup/Components/Admin/OrderList/OrderList';
import OrderView from './Markup/Components/Admin/OrderView/OrderView';
import OrderEdit from './Markup/Components/Admin/OrderEdit/OrderEdit';
import CreateOrder from './Markup/Components/Admin/CreateOrder/CreateOrder';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/view/:id" element={<OrderView />} />
        <Route path="/orders/edit/:id" element={<OrderEdit />} />
        <Route path="/orders/create" element={<CreateOrder />} />
      </Routes>
    </Router>
  );
};

export default App;
