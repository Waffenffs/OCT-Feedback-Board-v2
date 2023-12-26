import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OlivFeedbacks",
    description: "A platform of expression for Olivarians",
    keywords: [
        "education",
        "feedbacks",
        "olivarez",
        "olivarian",
        "oct",
        "thesis",
        "capstone",
        "project",
    ],
    openGraph: {
        images: "/oct-logo.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={`${inter.className} bg-gray-200`}>{children}</body>
        </html>
    );
}
