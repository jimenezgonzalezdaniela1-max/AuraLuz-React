import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Store from "./pages/Store";
import Admin from "./pages/Admin";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login role="cliente" />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/admin/login" element={<Login role="admin" />} />
      <Route path="/" element={<ProtectedRoute role="cliente"><Store /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
