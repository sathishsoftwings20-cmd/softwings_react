import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";

/* Layouts (lazy) */
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

/* Auth Pages (lazy) */
const Login = lazy(() => import("../views/authentication/Login"));
const Register = lazy(() => import("../views/authentication/Register"));
const Error = lazy(() => import("../views/authentication/Error"));
const LogoutPage = lazy(() =>
  import("../views/authentication/auth/AuthLogout.jsx")
);

/* Project Pages (lazy) */
const WelcomeHome = lazy(() => import("../views/public/WelcomeHome"));
const EnquiryList = lazy(() => import("../views/Enquiry/EnquiryList"));
const EnquiryAdd = lazy(() => import("../views/Enquiry/EnquiryAdd"));
const UserRegister = lazy(() => import("../views/user/UserRegister.jsx"));
const UserList = lazy(() => import("../views/user/UserList.jsx"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));

/* Small fallback component for Suspense */
const Loader = () => <div style={{ padding: 20 }}>Loading...</div>;

/* Helper to wrap any element with Suspense */
const withSuspense = (el) => <Suspense fallback={<Loader />}>{el}</Suspense>;

const Router = [
  {
    path: "/",
    element: withSuspense(<WelcomeHome />),
  },

  {
    path: "/admin",
    element: withSuspense(
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: withSuspense(<Dashboard />) },

      // Enquiry
      { path: "enquiry/list", element: withSuspense(<EnquiryList />) },
      { path: "enquiry/add", element: withSuspense(<EnquiryAdd />) },

      // Users
      { path: "user/userList", element: withSuspense(<UserList />) },
      { path: "user/register", element: withSuspense(<UserRegister />) },

      // 404 for admin
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },

  {
    path: "/auth",
    element: withSuspense(<BlankLayout />),
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "register", element: withSuspense(<Register />) },
      { path: "404", element: withSuspense(<Error />) },
      { path: "logout", element: withSuspense(<LogoutPage />) },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default createBrowserRouter(Router);
