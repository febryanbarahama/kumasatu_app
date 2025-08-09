// Dashboard.jsx
import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
