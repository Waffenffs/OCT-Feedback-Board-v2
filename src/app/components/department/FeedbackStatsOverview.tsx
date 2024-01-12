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
    }, []);

    if (isLoading) return <>Loading...</>;

    const overviewCardsColors: Record<
        TFeedbackStatus,
        Record<string, string>
    > = {
        Pending: {
            article: "bg-gradient-to-b from-orange-400 to-orange-600",
            span: "text-orange-400",
        },
        Resolved: {
            article: "bg-gradient-to-b from-green-500 to-green-600",
            span: "text-green-500",
        },
        Flagged: {
            article: "bg-gradient-to-b from-red-500 to-red-600",
            span: "text-red-500",
        },
    };

    const overviewCards = ["Pending", "Resolved", "Flagged"].map((status) => (
        <article
            className={`${
                overviewCardsColors[status as TFeedbackStatus].article
            } w-full px-3 py-4 flex flex-col items-center gap-2 shadow rounded transition duration-200 hover:shadow-xl`}
        >
            <h1 className='font-semibold tracking-wider text-xl'>{status}</h1>
            <span
                className={`text-white text-xl flex justify-center items-center font-bold `}
            >
                {feedbackCounts[status as TFeedbackStatus]}
            </span>
        </article>
    ));

    return (
        <header className='w-full flex justify-around items-center gap-3'>
            {overviewCards}
        </header>
    );
}
