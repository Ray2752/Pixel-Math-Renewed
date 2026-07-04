export default function Footer() {
  return (
    <footer className="app-footer">
      <span>© {new Date().getFullYear()} La Salle Oaxaca</span>
      <div className="app-footer-links">
        <a
          href="https://github.com/Ray2752/Pixel-Math-Renewed"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
