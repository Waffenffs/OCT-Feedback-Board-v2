import { Metadata } from "next";

import DashboardLayout from "@/app/components/ui/DashboardLayout";

export const metadata: Metadata = {
    title: "Reports | OlivFeedbacks",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
