"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import FeedbackStatsOverview from "../components/department/FeedbackStatsOverview";
import StatusSection from "../components/department/StatusSection";
import DepartmentFeedbackCard from "../components/department/DepartmentFeedbackCard";

export type TFeedback = {
    feedback_created_at: string;
    feedback_creator_uid: string;
    feedback_description: string;
    feedback_id: string;
    feedback_reference: string;
    feedback_status: "Pending" | "Resolved" | "Flagged";
    feedback_title: string;
};

export default function Department() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchDepartmentFeedbacks = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${error}`;

            const user = session?.user;
            const userUID = user?.id;

            const { data: accountData, error: accountError } = await supabase
                .from("accounts")
                .select("account_id")
                .eq("account_uid", userUID);

            if (accountError)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${accountError}`;

            const accountID = accountData[0].account_id;

            const { data: feedback, error: feedbackFetchError } = await supabase
                .from("feedbacks")
                .select("*")
                .eq("feedback_reference", accountID);

            if (feedbackFetchError)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${feedbackFetchError}`;

            setFeedbacks(feedback);
            setLoading(false);
        };

        fetchDepartmentFeedbacks();
    }, []);

    const pendingFeedbacks = feedbacks
        ?.filter((fb: any) => fb.feedback_status === "Pending")
        .map((item: TFeedback, index: number) => {
            return <DepartmentFeedbackCard key={index} {...item} />;
        });

    const resolvedFeedbacks = feedbacks
        ?.filter((fb: any) => fb.feedback_status === "Resolved")
        .map((item: TFeedback, index: number) => {
            return <DepartmentFeedbackCard key={index} {...item} />;
        });

    const flaggedFeedbacks = feedbacks
        ?.filter((fb: any) => fb.feedback_status === "Flagged")
        .map((item: TFeedback, index: number) => {
            return <DepartmentFeedbackCard key={index} {...item} />;
        });

    return (
        <main className='w-full h-full p-10'>
            <FeedbackStatsOverview />

            <StatusSection status='Pending' marginTop={10} />
            <section className='flex flex-col gap-1 w-full'>
                {pendingFeedbacks}
            </section>

            <StatusSection status='Resolved' marginTop={10} />
            <section className='flex flex-col gap-1 w-full'>
                {resolvedFeedbacks}
            </section>

            <StatusSection status='Flagged' marginTop={10} />
            <section className='flex flex-col gap-1 w-full'>
                {flaggedFeedbacks}
            </section>
        </main>
    );
}
