import "./globals.css";
import { Geist } from "next/font/google";
import 'react-tooltip/dist/react-tooltip.css'

const font = Geist({
  weight: ["400", "700"],
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.className} bg-primary`} >
      <body className =  "min-h-screen bg-[url('./img/mountains2.jpg')] " >
        {children}
      </body>
    </html>
  );
}
