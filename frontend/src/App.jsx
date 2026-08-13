import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MatrixOperations from "./pages/MatrixOperations";
import ImageFilters from "./pages/ImageFilters";
import ImageComposition from "./pages/ImageComposition";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Sidebar />
      <div className="app-main">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matrix-operations" element={<MatrixOperations />} />
            <Route path="/image-filters" element={<ImageFilters />} />
            <Route path="/image-composition" element={<ImageComposition />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
