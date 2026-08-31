import { Route, Routes } from "react-router";

import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/home/index.jsx";
import Articles from "./pages/articles/index.jsx";
import Article from "./pages/article/index.jsx";
import Labs from "./pages/labs/index.jsx";
import Lab from "./pages/lab/index.jsx";
import About from "./pages/about/index.jsx";
import NotFound from "./pages/not-found/index.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:slug" element={<Article />} />
        <Route path="labs" element={<Labs />} />
        <Route path="labs/:slug" element={<Lab />} />
        <Route path="sobre" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
