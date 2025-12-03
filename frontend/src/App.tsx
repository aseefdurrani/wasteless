import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import ContextDummy from "./pages/contextDummy";

export default function App() {
  return (
    // 🎯 Wrap your app with Context Providers
    // Order matters: AuthProvider first, then UIProvider
    // This makes auth available to UI logic if needed
    <AuthProvider>
      <UIProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="contextTest" element={<ContextDummy />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}
