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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storage = localStorage.getItem('shopora-storage');
                if (storage) {
                  const state = JSON.parse(storage);
                  const theme = state?.state?.theme || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#fafafa] dark:bg-[#05060b] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col justify-between transition-colors duration-300">
        <div>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
