"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { PiStudentLight } from "react-icons/pi";
import { MdRefresh } from "react-icons/md";

import CommentCard from "@/app/components/feedback/CommentCard";
import CommentInput from "@/app/components/feedback/CommentInput";
import CommentSkeleton from "@/app/components/feedback/CommentSkeleton";
import PageFlag from "@/app/components/ui/PageFlag";
import Link from "next/link";

import {
    getAccountInfoWithID,
    getAccountInfoWithUID,
    getFeedbackData,
} from "@/app/utils/supabaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type TCombinedData = {
    feedback: TFeedback;
    creator: TUser | null;
    referredDepartment: string | undefined;
};

export default function Feedback() {
    // Task: Fetch comments from oldest to newest

    const [pageData, setPageData] = useState<TCombinedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [feedbackComments, setFeedbackComments] = useState<TComment[] | null>(
        null
    );
    const [refreshComments, setRefreshComments] = useState(false);
    const [loadingFeedbackComments, setLoadingFeedbackComments] =
        useState(false);

    const searchParams = useSearchParams();
    const feedbackId = searchParams.get("id");

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchComments = async () => {
            setLoadingFeedbackComments(true);

            const { data: comments, error: fetchingError } = await supabase
                .from("comments")
                .select("*")
                .eq("feedback_id", feedbackId);

            if (fetchingError) throw fetchingError;

            const maxTimeout = 2000;
            const randomTimeout = Math.random() * maxTimeout;

            setTimeout(() => {
                setLoadingFeedbackComments(false);
            }, randomTimeout);

            setFeedbackComments(comments);
        };

        fetchComments();
    }, [refreshComments]);

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
            const formattedDate = `Created at ${
                months[feedbackTimestamp.getMonth()]
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
            <div className='w-full h-screen py-14 px-10 bg-white mt-10 rounded-t-[4rem] animate-pulse'>
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

    const feedbackCommentsExist =
        feedbackComments && feedbackComments.length >= 1;
    const commentCards =
        feedbackCommentsExist &&
        feedbackComments.map((comment, index) => (
            <CommentCard
                key={index}
                props={comment}
                status={pageData?.feedback.feedback_status!}
            />
        ));

    return (
        <div className='w-full h-full py-14 px-10 bg-white mt-5 text-slate-900 rounded-t-[4rem] shadow-2xl'>
            <div className='flex justify-start'>
                <Link
                    href={"/"}
                    className='flex flex-row items-center gap-2 text-sm font-bold text-blue-500'
                >
                    <FaLongArrowAltLeft />
                    <span>Home</span>
                </Link>
            </div>

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

                <p className='mt-5 whitespace-pre-wrap'>
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

            <section className='mt-32'>
                <hr className='w-full h-2 my-5'></hr>
                <CommentInput
                    status={pageData?.feedback.feedback_status!}
                    feedbackId={pageData?.feedback.feedback_id!}
                    refComments={() =>
                        setRefreshComments((prevState) => !prevState)
                    }
                />
            </section>

            <section className='mt-16'>
                <div className='flex w-full justify-between items-center'>
                    <h1 className='font-semibold text-2xl'>Comments</h1>
                    <button
                        onClick={() =>
                            setRefreshComments((prevState) => !prevState)
                        }
                        className='flex flex-row gap-1 items-center text-sm font-semibold tracking-wide text-blue-500'
                    >
                        <MdRefresh />
                        <span>Refresh</span>
                    </button>
                </div>
                <hr className='h-px mt-4 bg-gray-300 border-0' />

                <section className='flex flex-col gap-5 mt-7'>
                    {loadingFeedbackComments ? (
                        <>
                            <CommentSkeleton />
                            <CommentSkeleton />
                            <CommentSkeleton />
                            <CommentSkeleton />
                            <CommentSkeleton />
                        </>
                    ) : (
                        commentCards
                    )}
                </section>
            </section>
        </div>
    );
}
