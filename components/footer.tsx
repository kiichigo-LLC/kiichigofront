export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer">
        <div className="footer-inr">
          <div className="footer-copyright">
            <span>
              {year} <s>&copy;</s> Kiichigo LLC
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
