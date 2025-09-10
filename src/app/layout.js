import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./Components/Navbar/Navbar";
import SessionProvider from "@/Providers/SessionProvider";
import Footer from "./Components/Footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookShore",
  description: "Your online bookstore with amazing collections.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {" "}
          <Navbar />
          <div className="min-h-screen">{children}</div>
          <Toaster position="top-center" reverseOrder={false} />
          <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}
