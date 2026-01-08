import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local';
import { Providers } from '@/app/components/Providers';
import { DynamicTitle } from '@/app/components/DynamicTitle';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });


// const myFont = localFont({
//   src: [
//     {
//       path: '/public/assets/fonts/Gotham Book.otf',
//       // weight: '400',
//       // style: 'normal',
//     },
//   ],
//   display: 'swap', // Recommended for performance
// });



export const metadata = {
  title: 'Products | Royal Japan Official Online Store',
  description: 'Royal Japan Official Online Store - Premium quality products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.svg" sizes="any" />

      <body
          // className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          <DynamicTitle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
