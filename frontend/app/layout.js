import { Plus_Jakarta_Sans } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'DevNixEdu - Smart School Management System',
  description:
    'Complete school management system to handle admissions, attendance, exams, fees, and parent communication—all in one platform.',
  keywords: ['school management', 'Pakistan', 'DevNixEdu', 'education ERP'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}