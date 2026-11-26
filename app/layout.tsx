import "./globals.css";
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta-sans',
})

// Runs before first paint so the correct theme class is applied without a flash.
// Must mirror the logic in getCurrentTheme/getTheme in lib/utils.ts.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The script mutates <html>'s class before hydration, so suppress the mismatch warning
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`antialiased text-text-secondary ${plusJakartaSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
