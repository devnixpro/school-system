const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 py-8 mt-auto">
      <div className="container-custom text-center text-sm text-navy-500">
        © {YEAR} DevNixPro. All rights reserved.
      </div>
    </footer>
  );
}
