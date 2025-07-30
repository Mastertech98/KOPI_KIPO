import React, { useState } from 'react';
import NavbarMenu from './NavbarMenu';

export default function TestNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Logged out');
  };

  return (
    <div>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        Toggle Login State (Current: {isLoggedIn ? 'Logged In' : 'Logged Out'})
      </button>
      <NavbarMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    </div>
  );
}
