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

            let statusCounts = {
                Pending: 0,
                Resolved: 0,
                Flagged: 0,
            };
            feedback_status.forEach((feedback) => {
                statusCounts[
                    feedback.feedback_status as
                        | "Pending"
                        | "Resolved"
                        | "Flagged"
                ]++;
            });
            setFeedbackCounts({ ...statusCounts });

            setIsLoading(false);
        };

        fetchFeedbackStatuses();
    }, []);

    if (isLoading) return <>Loading...</>;

    return (
        <header>
            <article></article>
        </header>
    );
}
