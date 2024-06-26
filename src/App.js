import logo from './logo.svg';
import './App.css';

import StockHomepage from './pages/StockHomepage'; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";


export const stockRoutes = [
  {
    title: "Stock Home",
    link: "/stock/home",
    element: <StockHomepage />,
  },
  {
    title: "Stock Update",
    link: "/stock/home/update",
    element: <StockHomepage />,
  },
  {
    title: "Stock Order Review",
    link: "/stock/order_review",
    element: < StockHomepage/>,
  }
];


function App() {
  return (
    <BrowserRouter>

      <Suspense>
        <Routes>
          <Route path="/*" element={<StockHomepage />} />
          <Route path="/stock/update" element={<StockHomepage />} />
          <Route path="/stock/order_review*" element={<StockHomepage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
