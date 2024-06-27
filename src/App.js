import logo from './logo.svg';
import './App.css';

import AppHomepage from './pages/AppHomepage';
import StockHomepage from './pages/StockHomepage'; 
import Orderpage from './pages/Orderpage'; 
import StockAddpage from './pages/StockAddpage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import StockCategorypage from './pages/StockCategorypage';


function App() {
  return (
    <BrowserRouter>

      <Suspense>
        <Routes>
          <Route path="/*" element={<AppHomepage />} />
          <Route path="/stock" element={<StockCategorypage/> } />
          <Route path="/stock/:categoryID" element={<StockHomepage />} />
          <Route path="/stock/order" element={<Orderpage />} />
          <Route path="/stock/add_stock" element={<StockAddpage />} />
          <Route path="/stock/add_stock" element={<StockAddpage />} />
          <Route path="/stock/order_review*" element={<StockHomepage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
