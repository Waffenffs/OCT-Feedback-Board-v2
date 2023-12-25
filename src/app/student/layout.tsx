import { Metadata } from "next";

import DashboardLayout from "../components/ui/DashboardLayout";

export const metadata: Metadata = {
    title: "Home | OlivFeedbacks",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
