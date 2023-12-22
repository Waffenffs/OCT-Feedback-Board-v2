"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import StudentFeedbackCard from "./StudentFeedbackCard";

export default function StudentFeedbackList() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's email
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError) throw userError;

                const userUID = user?.id;

                // Fetch user's feedbacks
                const { data: feedbacksData, error: feedbacksError } =
                    await supabase
                        .from("feedbacks")
                        .select("*")
                        .eq("feedback_creator_uid", userUID);

                if (feedbacksError) throw feedbacksError;

                setFeedbacks(feedbacksData);
                setIsLoading(false);
            } catch (error) {
                console.error(
                    `Error fetching data for feedback list: ${error}`
                );
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div className='w-full h-full'>&nbsp;</div>;

    const studentFeedbackCards = feedbacks.map((feedback: any) => (
        <StudentFeedbackCard
            feedback_title={feedback.feedback_title}
            feedback_description={feedback.feedback_description}
            feedback_status={feedback.feedback_status}
        />
    ));

    return (
        <main className='w-full h-full p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-8'>
            <header>
                <h1 className='text-3xl font-bold text-slate-900 tracking-wider'>
                    Your Feedbacks
                </h1>
            </header>

            <section className='flex flex-col gap-1'>
                {studentFeedbackCards}
            </section>
        </main>
    );
}
