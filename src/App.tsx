import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./componts/Sidebar";
import Users from "./componts/Users";
import Bookings from "./componts/Booking";
import Events from "./componts/reviews";
import University from "./componts/getAllTour";
import "./App.css";
import Reviews from "./componts/reviews";
import Guide from "./componts/guide"

const App: React.FC = () => {
  return (
    <Router>
      
        <Sidebar />
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/events" element={<Events />} />
            <Route path="/All Tour" element={<University />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
      
    </Router>
  );
};

export default App;
