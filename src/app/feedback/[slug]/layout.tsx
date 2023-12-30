import { Metadata } from "next";
import { headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import DashboardLayout from "@/app/components/ui/DashboardLayout";

export async function generateMetadata() {
    const url = new URL(headers().get("x-url")!);
    const feedbackId = url.searchParams.get("id")?.split("/")[0];

    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from("feedbacks")
        .select("feedback_title")
        .eq("feedback_id", feedbackId);

    if (error) throw `Origin app/feedback/[slug]/layout.tsx >>: ${error}`;

    const feedbackTitle = data[0].feedback_title;

    const metadata: Metadata = {
        title: `${feedbackTitle} | OlivFeedbacks`,
    };

    return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
