import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Dosis } from "next/font/google";

const font = Dosis({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ls_dev",
    description: "Hmmm... its ls_dev",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <body className={cn(font.className)}>{children}</body>
        </html>
    );
}
