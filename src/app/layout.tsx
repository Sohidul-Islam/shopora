import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Shopora',
  description: 'Enterprise E-commerce Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05060b] text-slate-100 antialiased min-h-screen flex flex-col justify-between">
        <div>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
