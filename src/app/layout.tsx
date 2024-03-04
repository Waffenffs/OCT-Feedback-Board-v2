// import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
    title: "OlivFeedbacks",
    description: "A platform of expression for Olivarians",
    keywords: [
        "student",
        "education",
        "feedbacks",
        "olivarez",
        "olivarian",
        "oct",
        "thesis",
        "capstone",
        "project",
    ],
};

// const inter = Inter({
//     subsets: ["latin"],
//     display: "swap",
// });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // className={inter.className}

    // TO-DO: Re-implement inter when internet connection is more stable
    return (
        <html lang='en'>
            <body className='bg-gray-200'>{children}</body>
        </html>
    );
}
