"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import FeedbackStatsOverview from "../components/department/FeedbackStatsOverview";
import StatusSection from "../components/department/StatusSection";
import DepartmentFeedbackCard from "../components/department/DepartmentFeedbackCard";

import {
    getUserInfo,
    getAccountInfoWithUID,
    getReferencedFeedbacks,
} from "../utils/supabaseUtils";

export default function Department() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchDepartmentFeedbacks = async () => {
            const { user } = await getUserInfo(supabase);

            const account = await getAccountInfoWithUID(supabase, user?.id!);

            const retrievedFeedbacks = await getReferencedFeedbacks(
                supabase,
                account?.account_id!
            );

            setFeedbacks(retrievedFeedbacks);
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
