"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

import { PiStudentLight } from "react-icons/pi";

import PageFlag from "@/app/components/ui/PageFlag";

type TFeedback = {
    feedback_id: number;
    feedback_reference: number;
    feedback_creator_uid: string;
    feedback_title: string;
    feedback_description: string;
    feedback_status: "Pending" | "Resolved" | "Flagged";
    feedback_created_at: string;
};

type TCreator = {
    account_id: number;
    account_name: string;
    account_type: "Student";
    account_uid: string;
};

type TCombinedData = {
    feedback: TFeedback;
    creator: TCreator;
};

export default function Feedback() {
    // FEATURES_TO_IMPLEMENT:
    // 1. Creator can make it public/private to other students
    // 2. Only the administrator, creator, and the department can access this feedback.
    // --- > Unless it is public. Feedbacks are private by default

    const [pageData, setPageData] = useState<TCombinedData | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const feedbackId = searchParams.get("id");

    useEffect(() => {
        const fetchData = async () => {
            const { data: feedback_data, error } = await supabase
                .from("feedbacks")
                .select("*")
                .eq("feedback_id", feedbackId);

            if (error) throw error;

            const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            const feedbackTimestamp = new Date(
                feedback_data[0].feedback_created_at
            );
            const formattedDate = `Created at ${
                months[feedbackTimestamp.getMonth()]
            } ${feedbackTimestamp.getDay()}, ${feedbackTimestamp.getFullYear()}`;

            const feedbackData: TFeedback = {
                ...feedback_data[0],
                feedback_created_at: formattedDate,
            };

            const { data: creator_data, error: error_one } = await supabase
                .from("accounts")
                .select("*")
                .eq("account_uid", feedbackData.feedback_creator_uid);

            if (error_one) throw error_one;

            const creatorData = creator_data[0];

            setPageData({
                feedback: feedbackData,
                creator: creatorData,
            });
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <div className='w-full h-full py-14 px-10 bg-white mt-10 rounded-t-[4rem] animate-pulse'>
                <div className='w-full flex justify-between items-center'>
                    <div className='h-5 w-32 bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                    <div className='h-5 w-28 bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                </div>

                <div className='flex flex-col gap-5 mt-7'>
                    <div className='h-8 w-72 bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                    <div className='flex flex-col gap-1'>
                        <div className='h-5 w-[30rem] bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                        <div className='h-5 w-[27rem] bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                        <div className='h-5 w-[24rem] bg-zinc-200 dark:bg-zinc-400 rounded'></div>
                    </div>
                </div>

                <div className='mt-32 h-14 w-full p-5 bg-zinc-200 dark:bg-zinc-400 rounded'></div>
            </div>
        );

    return (
        <div className='w-full h-full py-14 px-10 bg-white mt-10 text-slate-900 rounded-t-[4rem] shadow-2xl'>
            <header className='w-full flex justify-between items-center text-slate-600 text-sm'>
                <section className='flex flex-row gap-1 items-end '>
                    <PiStudentLight className='text-2xl' />
                    <span className='font-semibold '>
                        {pageData?.creator.account_name}
                    </span>
                </section>

                <span>{pageData?.feedback.feedback_created_at}</span>
            </header>

            <section className='flex flex-col gap-5 mt-5'>
                <h1 className='font-bold text-3xl text-black'>
                    {pageData?.feedback.feedback_title}
                </h1>

                <p>{pageData?.feedback.feedback_description}</p>
            </section>

            {pageData && (
                <PageFlag
                    status={
                        pageData?.feedback.feedback_status as
                            | "Pending"
                            | "Resolved"
                            | "Flagged"
                    }
                />
            )}
        </div>
    );
}
