import { Outlet } from "react-router";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
