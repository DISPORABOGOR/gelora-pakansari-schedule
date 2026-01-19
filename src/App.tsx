import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicDisplay from "./pages/PublicDisplay";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicDisplay />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
