import logo from './logo.svg';
import './App.css';

import StockHomepage from './pages/StockHomepage'; 
import Orderpage from './pages/Orderpage'; 
import StockAddpage from './pages/StockAddpage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";


function App() {
  return (
    <BrowserRouter>

      <Suspense>
        <Routes>
          <Route path="/*" element={<StockHomepage />} />
          <Route path="/stock/order" element={<Orderpage />} />
          <Route path="/stock/add_stock" element={<StockAddpage />} />
          <Route path="/stock/order_review*" element={<StockHomepage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
