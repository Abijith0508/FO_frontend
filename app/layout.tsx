import "./globals.css";
import { Roboto, Lexend_Deca, Geist } from "next/font/google";

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
    <html lang="en" className={font.className} >
      <body className =  "bg-[url('./img/mountains2.jpg')] " >
        {children}
      </body>
    </html>
  );
}
