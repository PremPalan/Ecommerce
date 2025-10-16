// Header.jsx
import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';

import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/logo-white.png';
import MobileLogoWhite from '../assets/images/mobile-logo-white.png';
import './header.css';

export function Header({ cart = [] }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(searchText);

  const updateSearchInput = (event) => setSearch(event.target.value);

  const searchProducts = () => {
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  const totalQuantity = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <div className="header">
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <img className="logo" src={LogoWhite} alt="Logo" />
          <img className="mobile-logo" src={MobileLogoWhite} alt="Mobile logo" />
        </NavLink>
      </div>

      <div className="middle-section">
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={search}
          onChange={updateSearchInput}
        />

        <button className="search-button" onClick={searchProducts} aria-label="Search">
          <img className="search-icon" src={SearchIcon} alt="Search" />
        </button>
      </div>

      <div className="right-section">
        <NavLink className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src={CartIcon} alt="Cart" />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>
      </div>
    </div>
  );
}
