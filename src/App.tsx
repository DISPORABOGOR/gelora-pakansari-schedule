import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicDisplay from "./pages/PublicDisplay";
import AdminPanel from "./pages/AdminPanel";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
