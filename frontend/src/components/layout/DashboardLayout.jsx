import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-layout">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
