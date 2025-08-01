import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoWhite from '../logo/logo white.png'

function NavbarMenu({ isLoggedIn, isAdmin , onLogout }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  

  // Buat array link dinamis dengan kondisi show
  const links = [
    { key: 'home', to: '/', label: 'Home', show: true, isButton: false },
    { key: 'cart', to: '/cart', label: 'Cart', show: true, isButton: false },
    { key: 'admin', to: '/admin', label: 'Admin', show: isLoggedIn && isAdmin, isButton: false },
    { key: 'orders', to: '/orders', label: 'Order', show: isLoggedIn && isAdmin, isButton: false },
    { key: 'pembukuan', to: '/pembukuan', label: 'Pembukuan', show: isLoggedIn && isAdmin, isButton: false },
    { key: 'contactus', to: '/contactus', label: 'Contact Us!', show: true, isButton: false },
  ];

  // Logout/ Login sebagai elemen khusus di akhir
  const authElement = isLoggedIn ? (
    { key: 'logout', label: <button onClick={handleLogoutClick}>Logout</button>, show: true, isButton: true }
  ) : (
    { key: 'login', to: '/login', label: 'Login', show: true, isButton: false }
  );

  // Filter yang show=true untuk ditampilkan
  const activeLinks = links.filter(link => link.show);

  // Gabungkan dengan auth elemen di akhir
  if (authElement.show) {
    activeLinks.push(authElement);
  }

  return (
    <div className='navbar-wrapper'>
      <nav>
        <span className='logo-wrapper'>
        <img
          src={logoWhite}
          alt='Kopi Kipo Logo'
          style={{ height: '60px', marginBottom: '1rem' }}
        />
      </span>
        {activeLinks.map((link, idx) => (
          <span key={link.key}>
            {link.isButton ? (
              link.label
            ) : (
              <NavLink to={link.to}>{link.label}</NavLink>
            )}
            {/* Tampilkan pembatas '|' jika bukan elemen terakhir */}
            {idx < activeLinks.length - 1 && ' | '}
          </span>
        ))}
      </nav>
    </div>
  );
}

export default NavbarMenu;
