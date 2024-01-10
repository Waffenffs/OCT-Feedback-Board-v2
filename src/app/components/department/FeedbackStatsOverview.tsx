"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type TFeedbackStatus = "Pending" | "Resolved" | "Flagged";

export default function FeedbackStatsOverview() {
    const supabase = createClientComponentClient();

    const [isLoading, setIsLoading] = useState(true);
    const [feedbackCounts, setFeedbackCounts] = useState<
        Record<TFeedbackStatus, number>
    >({
        Pending: 0,
        Resolved: 0,
        Flagged: 0,
    });

    useEffect(() => {
        const fetchFeedbackStatuses = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${error}`;

            const userUID = session?.user.id;
            const { data, error: account_error } = await supabase
                .from("accounts")
                .select("account_id")
                .eq("account_uid", userUID);

            if (account_error)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${account_error}`;

            let userID;
            if (data) {
                userID = data[0].account_id;
            }
            const { data: feedback_status, error: feedback_error } =
                await supabase
                    .from("feedbacks")
                    .select("feedback_status")
                    .eq("feedback_reference", userID);

            if (feedback_error)
                throw `Origin components/department/FeedbackStatsOverview.tsx >>: ${feedback_error}`;

            let statusCounts: Record<TFeedbackStatus, number> = {
                Pending: 0,
                Resolved: 0,
                Flagged: 0,
            };
            feedback_status.forEach((feedback) => {
                statusCounts[feedback.feedback_status as TFeedbackStatus]++;
            });
            setFeedbackCounts({ ...statusCounts });

            setIsLoading(false);
        };

        fetchFeedbackStatuses();

        // console.log(feedbackCounts);
    }, []);

    console.log(feedbackCounts);

    if (isLoading) return <>Loading...</>;

    return (
        <header className='w-full flex justify-center items-center gap-10'>
            <article className='w-44 flex flex-col items-center gap-1 bg-gradient-to-b from-orange-400 to-orange-600 shadow py-4 rounded transition duration-200 hover:shadow-xl'>
                <h1 className='font-bold text-lg tracking-wider'>Pending</h1>
                <span>{feedbackCounts["Pending"]}</span>
            </article>

            <article className='w-44 flex flex-col items-center gap-1 bg-gradient-to-b from-green-500 to-green-600 shadow py-4 rounded transition duration-200 hover:shadow-xl'>
                <h1 className='font-bold text-lg tracking-wider'>Resolved</h1>
                <span>{feedbackCounts["Resolved"]}</span>
            </article>

            <article className='w-44 flex flex-col items-center gap-1 bg-gradient-to-b from-red-500 to-red-600 shadow py-4 rounded transition duration-200 hover:shadow-xl'>
                <h1 className='font-bold text-lg tracking-wider'>Flagged</h1>
                <span>{feedbackCounts["Flagged"]}</span>
            </article>
        </header>
    );
}
