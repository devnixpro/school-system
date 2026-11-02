import "./globals.css";

export const metadata = {
  title: "Parent Portal | DevNixEdu",
  description: "DevNixEdu Parent Portal — attendance, results, fees and homework overview.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
