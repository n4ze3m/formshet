import React from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div>
            <h1>Dashboard Layout</h1>
            <Outlet />
        </div>
    )
}