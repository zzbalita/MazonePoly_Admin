import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AdminLayout from "./layouts/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import ProductAdd from "./pages/ProductAdd";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Sizes from "./pages/Sizes";
import Descriptions from "./pages/Descriptions";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes - được bảo vệ */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <AdminLayout>
              <ProductAdd />
            </AdminLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminLayout>
              <Categories />
            </AdminLayout>
          }
        />
        <Route
          path="/brands"
          element={
            <AdminLayout>
              <Brands />
            </AdminLayout>
          }
        />
        <Route
          path="/sizes"
          element={
            <AdminLayout>
              <Sizes />
            </AdminLayout>
          }
        />
        <Route
          path="/descriptions"
          element={
            <AdminLayout>
              <Descriptions />
            </AdminLayout>
          } />
        <Route path="/products/:id"
          element={
            <AdminLayout>
              <ProductDetail />
            </AdminLayout>
          } />
        <Route path="/products/edit/:id"
          element={
            <AdminLayout>
              <ProductEdit />
            </AdminLayout>
          } />



      </Routes>
    </Router>
  );
}

export default App;
