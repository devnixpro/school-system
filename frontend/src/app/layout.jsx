import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://devnixedu.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DevNixEdu — Multi-Tenant School Management Platform",
    template: "%s | DevNixEdu",
  },
  description:
    "DevNixEdu is a modern, multi-tenant school management platform by DevNixPro.",
  keywords: ["school management system", "school ERP", "multi-tenant SaaS", "DevNixEdu"],
  openGraph: {
    type: "website",
    siteName: "DevNixEdu",
    url: SITE_URL,
    title: "DevNixEdu — Multi-Tenant School Management Platform",
    description: "Digitize your school operations with DevNixEdu.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-inter antialiased">
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}