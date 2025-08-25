import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
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
import ForgotPassword from "./pages/ForgotPassword";
import CustomerList from "./pages/CustomerList";
import CustomerDetail from "./pages/CustomerDetail";
import OrderList from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProductStatistics from "./pages/ProductStatistics";
import AdminChatDashboard from "./pages/AdminChatDashboard";

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
              <PrivateRoute>
                <AdminLayout>
                  <ProductAdd />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Brands />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sizes"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Sizes />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/descriptions"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Descriptions />
                </AdminLayout>
              </PrivateRoute>
            } />
          <Route path="/products/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ProductDetail />
                </AdminLayout>
              </PrivateRoute>
            } />
          <Route path="/products/edit/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ProductEdit />
                </AdminLayout>
              </PrivateRoute>
            } />

          <Route path="/customers"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <CustomerList />
                </AdminLayout>
              </PrivateRoute>
            } />


          <Route path="/admin/customers/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <CustomerDetail />
                </AdminLayout>
              </PrivateRoute>
            } />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <OrderList />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <OrderDetail />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics/products"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <ProductStatistics />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          {/* Admin Chat Route */}
          <Route
            path="/admin/chat"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <AdminChatDashboard />
                </AdminLayout>
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
