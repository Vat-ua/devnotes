import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

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
