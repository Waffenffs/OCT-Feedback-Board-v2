import DashboardLayout from "@/app/components/ui/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | Metadata",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
