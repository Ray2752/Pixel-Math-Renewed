import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/matrix-operations", label: "Matrix Operations" },
  { to: "/image-filters", label: "Image Filters" },
  { to: "/image-composition", label: "Image Composition" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-title" style={{ textDecoration: "none" }}>
          Pixel-Math
        </NavLink>
        <div className="sidebar-subtitle">Terminal v1.0.4</div>
      </div>

      <nav className="sidebar-nav">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar-nav-link active" : "sidebar-nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/documentation">Documentation</NavLink>
      </div>
    </aside>
  );
}
