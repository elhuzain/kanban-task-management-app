import "./globals.css";
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const siteName = 'Kanban Task Manager'
const description =
  'Organize your work with a Kanban board. Create boards and columns, add tasks with subtasks, drag and drop between columns, and switch between light and dark themes.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: ['kanban', 'task management', 'project board', 'todo', 'productivity', 'drag and drop'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName,
    title: siteName,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F7FD' },
    { media: '(prefers-color-scheme: dark)', color: '#20212C' },
  ],
  colorScheme: 'light dark',
}

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
