import DashboardLayout from "@/app/components/ui/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
