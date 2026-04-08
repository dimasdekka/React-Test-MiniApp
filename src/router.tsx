import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProductListPage from "./pages/ProductListPage";
import AddProductPage from "./pages/AddProductPage";

const router = createBrowserRouter([
  {
    path: "login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        // Protected routes — harus ter autentikasi
        Component: ProtectedRoute,
        children: [
          {
            path: "products",
            Component: ProductListPage,
          },
          {
            path: "products/new",
            Component: AddProductPage,
          },
        ],
      },
    ],
  },
]);

export default router;
