import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MatrixOperations from "./pages/MatrixOperations";
import ImageFilters from "./pages/ImageFilters";
import ImageComposition from "./pages/ImageComposition";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";

function App() {
  return (
    <div className="app-shell">
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
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
