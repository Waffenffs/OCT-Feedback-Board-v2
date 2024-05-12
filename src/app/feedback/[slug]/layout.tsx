import { Metadata } from "next";
import { headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getFeedbackData } from "@/app/utils/supabaseUtils";

export async function generateMetadata() {
    const url = new URL(headers().get("x-url")!);
    const feedbackId = url.searchParams.get("id")?.split("/")[0];

    const supabase = createServerComponentClient({ cookies });

    try {
        const data = await getFeedbackData(supabase, feedbackId!);

        const feedbackTitle = data?.feedback_title;

        const metadata: Metadata = {
            title: `${feedbackTitle} | OlivFeedbacks`,
        };

        return metadata;
    } catch (error) {
        console.error(error);
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
