"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PiStudentLight } from "react-icons/pi";
import { FaLongArrowAltLeft } from "react-icons/fa";

import PageFlag from "@/app/components/ui/PageFlag";
import CommentInput from "@/app/components/feedback/CommentInput";
import Link from "next/link";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
    getFeedbackData,
    getAccountInfoWithUID,
    getAccountInfoWithID,
} from "@/app/utils/supabaseUtils";

type TCombinedData = {
    feedback: TFeedback;
    creator: TUser | null;
    referredDepartment: string | undefined;
};

export default function Feedback() {
    const [pageData, setPageData] = useState<TCombinedData | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const feedbackId = searchParams.get("id");

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
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

            const feedback = await getFeedbackData(supabase, feedbackId!);

            if (!feedback) console.error("Feedback data not found!");

            const feedbackTimestamp = new Date(
                feedback?.feedback_created_at as string
            );
            const formattedDate = `Created at ${months[feedbackTimestamp.getMonth()]
                } ${feedbackTimestamp.getDay()}, ${feedbackTimestamp.getFullYear()}`;

            const feedbackData: TFeedback = {
                ...feedback!,
                feedback_created_at: formattedDate,
            };

            const creator = await getAccountInfoWithUID(
                supabase,
                feedback?.feedback_creator_uid!
            );

            if (!creator) console.error("Creator not found!");

            const referredDepartment = await getAccountInfoWithID(
                supabase,
                feedbackData?.feedback_reference
            );

            if (!referredDepartment)
                console.error("Referred department not found!");

            setPageData({
                feedback: feedbackData,
                creator: creator,
                referredDepartment: referredDepartment?.account_name,
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
        <div className='w-full h-full py-14 px-10 bg-white mt-10 text-slate-900 rounded-t-[4rem] shadow-2xl overflow-auto'>
            <Link href={"/"} className="flex flex-row items-center gap-2 text-sm font-bold text-blue-500">
                <FaLongArrowAltLeft />
                <span>Home</span>
            </Link>

            <header className='w-full flex justify-between items-center text-slate-600 text-sm mt-5'>
                <section className='flex flex-row gap-1 items-end '>
                    <PiStudentLight className='text-2xl' />
                    <span className='font-semibold '>
                        {pageData?.creator && pageData?.creator.account_name}
                    </span>
                </section>

                <span>{pageData?.feedback.feedback_created_at}</span>
            </header>

            <section className='flex flex-col mt-5'>
                <h1 className='font-bold text-3xl text-black'>
                    {pageData?.feedback.feedback_title}
                </h1>

                <div className='mt-2'>
                    <span className='tracking-wider text-sm text-slate-600 bg-neutral-200 py-1 px-3 rounded'>
                        Regarding: {pageData?.referredDepartment}
                    </span>
                </div>

                <p className='mt-5'>
                    {pageData?.feedback.feedback_description}
                </p>
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

            <section className="mt-32">
                <CommentInput status={pageData?.feedback.feedback_status!} />
            </section>
        </div>
    );
}
