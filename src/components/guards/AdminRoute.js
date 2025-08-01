import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
    if (!user) {
      console.log("nilai user : ", user);
    // User belum login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // User login tapi bukan admin
    return <Navigate to="/" replace />;
  }

  // User sudah login dan berrole admin, render komponen children (admin page)
  return children;
};

export default AdminRoute;