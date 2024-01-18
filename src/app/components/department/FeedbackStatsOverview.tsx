"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getUserInfo, getAccountInfoWithUID } from "@/app/utils/supabaseUtils";
import { getStatusBackgroundColor } from "@/app/utils/helperUtils";

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
            const { user } = await getUserInfo(supabase);

            if (!user) return console.error("User does not exist!");

            const userUID = user?.id;

            const accountInfo = await getAccountInfoWithUID(supabase, userUID);

            let accountID = accountInfo?.account_id;

            const { data: feedback_status, error: feedback_error } =
                await supabase
                    .from("feedbacks")
                    .select("feedback_status")
                    .eq("feedback_reference", accountID);

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
    }, []);

    if (isLoading) return <>Loading...</>;

    const overviewCards = ["Pending", "Resolved", "Flagged"].map(
        (status, index) => {
            const statusBackgroundColor = getStatusBackgroundColor(
                status as TFeedbackStatus
            );

            return (
                <article
                    key={index}
                    className={`${statusBackgroundColor} w-full px-3 py-4 flex flex-col items-center gap-2 shadow rounded transition duration-200 hover:shadow-xl`}
                >
                    <h1 className='font-semibold tracking-wider text-xl'>
                        {status}
                    </h1>
                    <span
                        className={`text-white text-xl flex justify-center items-center font-bold `}
                    >
                        {feedbackCounts[status as TFeedbackStatus]}
                    </span>
                </article>
            );
        }
    );

    return (
        <header className='w-full flex justify-around items-center gap-3'>
            {overviewCards}
        </header>
    );
}
