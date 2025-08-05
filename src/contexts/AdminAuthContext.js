import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);

  // Khi load lại trang, cố gắng lấy thông tin từ localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminInfo');

    if (storedToken) setAdminToken(storedToken);
    if (storedAdmin) setAdminInfo(JSON.parse(storedAdmin));
  }, []);

  const login = (token, adminData) => {
    setAdminToken(token);
    setAdminInfo(adminData);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdminToken(null);
    setAdminInfo(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, adminInfo, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook để dùng trong component
export const useAdminAuth = () => useContext(AdminAuthContext);
