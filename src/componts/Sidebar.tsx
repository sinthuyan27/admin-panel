import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();

 

  return (
    <aside className="sidebar">
      <h2 className="logo">Admin Panel</h2>
      <nav>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">Users</Link>
          </li>
          <li className={location.pathname === "/bookings" ? "active" : ""}>
            <Link to="/bookings">Bookings</Link>
          </li>
          <li className={location.pathname === "/All Tour" ? "active" : ""}>
            <Link to="/All Tour">All Tour</Link>
          </li>
          <li className="{location.pathname === /reviews ? 'active' : ''}">
            <Link to="/reviews">Reviews</Link>
          </li>  
          <li className="{location.pathname === /guide ? 'active' : ''}">
            <Link to="/guide">guide</Link>
          </li>          
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;



