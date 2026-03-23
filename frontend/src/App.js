import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import Dashboard from "./pages/Dashboard";
import FileWizard from "./pages/FileWizard";
import Configurator from "./pages/Configurator";
import Credits from "./pages/Credits";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Invoices from "./pages/Invoices";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/file-wizard" element={<FileWizard />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </LanguageProvider>
  );
}

export default App;
