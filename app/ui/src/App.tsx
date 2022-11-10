import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import { FormHome } from "./pages/form";
import { FormCode } from "./pages/form/code";
import { FormIntergation } from "./pages/form/intergation";
import { FormSettings } from "./pages/form/settings";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { New } from "./pages/new";
import { Register } from "./pages/register";
import { Settings } from "./pages/settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/form/:id" element={<FormHome />} />
        <Route path="/form/:id/intergation" element={<FormIntergation />} />
        <Route path="/form/:id/code" element={<FormCode />} />
        <Route path="/form/:id/settings" element={<FormSettings />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="/auth" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>
    </Routes>
  );
}
