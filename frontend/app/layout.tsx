import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.css"
import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/Sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imgshare",
  description: "A website to share images for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " " + styles.background}>
        <Navbar/>
        <section className={styles.main}>
        <Sidebar/>
        <div className={styles.view}>
        {children}
        </div>
        </section>
        </body>
    </html>
  );
}
