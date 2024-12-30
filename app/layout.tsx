import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/lib/context/theme-context';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FormatterAI',
  description: 'A powerful tool to format and beautify JSON data',
};

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const savedTheme = localStorage.getItem('theme');
            const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.add(theme);
          } catch (e) {
            console.log('Failed to set initial theme');
          }
        `,
      }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
