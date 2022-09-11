import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
