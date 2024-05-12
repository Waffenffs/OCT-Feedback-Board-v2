"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import NoContent from "@/app/components/ui/NoContent";
import DepartmentFeedbackCard from "@/app/components/department/DepartmentFeedbackCard";
import FeedbackStatusButton from "@/app/components/department/FeedbackStatusButton";

import {
    getAccountInfoWithUID,
    getReferencedFeedbacks,
    getUserInfo,
} from "@/app/utils/supabaseUtils";

export default function Department() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [refreshFeedbacks, setRefreshFeedbacks] = useState(false);
    const [currentFeedbackStatus, setCurrentFeedbackStatus] =
        useState<TFeedbackStatus>("Pending");
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
    }, [refreshFeedbacks]);

    const refreshFeedback = () => {
        setRefreshFeedbacks((prevState) => !prevState);
    };

    const pendingFeedbacks = feedbacks?.filter(
        (fb: any) => fb.feedback_status === "Pending"
    );
    const resolvedFeedbacks = feedbacks?.filter(
        (fb: any) => fb.feedback_status === "Resolved"
    );
    const flaggedFeedbacks = feedbacks?.filter(
        (fb: any) => fb.feedback_status === "Flagged"
    );

    const feedbackElements = feedbacks
        ?.filter(
            (feedback: any) =>
                feedback.feedback_status === currentFeedbackStatus
        )
        .map((item: TFeedback, index: number) => {
            return (
                <DepartmentFeedbackCard
                    key={index}
                    feedback={item}
                    refreshFeedback={refreshFeedback}
                />
            );
        });

    return (
        <main className='w-full h-full p-10'>
            <header className='flex flex-row items-center gap-10 max-md:gap-2'>
                {loading ? (
                    <>
                        <div className='h-16 bg-zinc-200 rounded-2xl dark:bg-zinc-400 w-40'></div>
                        <div className='h-16 bg-zinc-200 rounded-2xl dark:bg-zinc-400 w-40'></div>
                        <div className='h-16 bg-zinc-200 rounded-2xl dark:bg-zinc-400 w-40'></div>
                    </>
                ) : (
                    <>
                        <FeedbackStatusButton
                            status='Pending'
                            set={setCurrentFeedbackStatus}
                            length={pendingFeedbacks?.length}
                            activeStatus={currentFeedbackStatus}
                        />
                        <FeedbackStatusButton
                            status='Resolved'
                            set={setCurrentFeedbackStatus}
                            length={resolvedFeedbacks?.length}
                            activeStatus={currentFeedbackStatus}
                        />
                        <FeedbackStatusButton
                            status='Flagged'
                            set={setCurrentFeedbackStatus}
                            length={flaggedFeedbacks?.length}
                            activeStatus={currentFeedbackStatus}
                        />
                    </>
                )}
            </header>
            <hr className='h-px mt-4 bg-gray-300 border-0 mb-5' />

            <section className='flex flex-col gap-1 w-full'>
                {loading && (
                    <section className='flex flex-col gap-2 animate-pulse'>
                        <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                        <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                        <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    </section>
                )}
                {feedbackElements?.length !== 0 ? (
                    feedbackElements
                ) : (
                    <NoContent />
                )}
            </section>
        </main>
    );
}
