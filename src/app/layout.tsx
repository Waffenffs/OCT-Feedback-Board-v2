import type { Metadata } from "next";

import "./globals.css";

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
            <body className={`bg-gray-200`}>{children}</body>
        </html>
    );
}
