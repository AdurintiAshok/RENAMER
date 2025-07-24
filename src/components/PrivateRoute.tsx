// components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
// import { auth } from "../utils/firebase"; // Adjust path as needed

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // const user = auth.currentUser;

  return  <Navigate to="/" />;
};

export default PrivateRoute;
