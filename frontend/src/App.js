import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import Dashboard from "./pages/Dashboard";
import FileWizard from "./pages/FileWizard";
import Configurator from "./pages/Configurator";
import Credits from "./pages/Credits";
import OrdersNew from "./pages/OrdersNew";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import Invoices from "./pages/Invoices";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import PriceList from "./pages/PriceList";
import NewOrderCombined from "./pages/NewOrderCombined";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/file-wizard" element={<FileWizard />} />
            <Route path="/new-order" element={<NewOrderCombined />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/orders" element={<OrdersNew />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
