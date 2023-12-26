"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import StudentFeedbackCard from "./StudentFeedbackCard";

export default function StudentFeedbackList() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [openFilterMenu, setOpenFilterMenu] = useState(false);
    const [filteredCategory, setFilteredCategory] = useState<
        ("Pending" | "Resolved" | "Flagged") | null
    >("Pending");
    const [filteredSort, setFilteredSort] = useState<
        ("Newest to Oldest" | "Oldest to Newest" | "Alphabetical") | null
    >(null);
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

    if (isLoading)
        return (
            <main className='w-full h-full p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-8 animate-pulse'>
                <header className='h-10 bg-zinc-200 rounded-full dark:bg-zinc-400 w-60'></header>

                <section className='flex flex-col gap-1'>
                    <div className='h-16 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-16 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-16 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-16 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                </section>
            </main>
        );

    const studentFeedbackCards = feedbacks.map(
        (feedback: any, index: number) => (
            <StudentFeedbackCard
                key={index}
                feedback_id={feedback.feedback_id}
                feedback_title={feedback.feedback_title}
                feedback_description={feedback.feedback_description}
                feedback_status={feedback.feedback_status}
                feedback_created_at={feedback.feedback_created_at}
            />
        )
    );

    return (
        <main className='w-full h-full p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-8'>
            <header className='w-full flex justify-between items-center tracking-wider'>
                <h1 className='text-3xl font-bold text-slate-900'>
                    Your Feedbacks
                </h1>

                <div className='relative'>
                    <button
                        onClick={() =>
                            setOpenFilterMenu((prevState) => !prevState)
                        }
                        className='text-sm text-blue-500 font-semibold'
                    >
                        Filter
                    </button>

                    {/* Convert this to filter menu component */}
                    {openFilterMenu && (
                        <article className='z-50 absolute -translate-x-80 mt-2 bg-[#1c1c1c] rounded shadow-xl px-5 py-3'>
                            <h2 className='text-lg text-green-500 font-bold'>
                                Categories
                            </h2>

                            <ul className='flex flex-row justify-start gap-3 mt-2 rounded'>
                                {["Pending", "Resolved", "Flagged"].map(
                                    (el, index) => {
                                        // ??
                                        const isActive =
                                            el === filteredCategory
                                                ? "true"
                                                : "false";

                                        // IDE is crying about booleans can't be used as index values
                                        const stylings = {
                                            true: "border-blue-400 text-blue-500 bg-neutral-100 font-semibold",
                                            false: "text-slate-600 bg-neutral-200",
                                        };

                                        return (
                                            <ul
                                                key={index}
                                                onClick={() =>
                                                    setFilteredCategory(
                                                        el as
                                                            | "Pending"
                                                            | "Resolved"
                                                            | "Flagged"
                                                    )
                                                }
                                                className={`${stylings[isActive]} text-xs transition duration-300 cursor-pointer w-24 py-1 px-3 rounded-full border-2 text-sm text-center`}
                                            >
                                                {el}
                                            </ul>
                                        );
                                    }
                                )}
                            </ul>

                            <h2 className='text-lg text-green-500 font-bold mt-5'>
                                Sort
                            </h2>

                            <ul className='flex flex-col gap-1 mt-2 w-full'>
                                {[
                                    "Newest to Oldest",
                                    "Oldest to Newest",
                                    "Alphabetical",
                                ].map((el, index) => {
                                    const isActive =
                                        filteredSort === el ? "true" : "false";

                                    const stylings = {
                                        true: "border-blue-400 text-blue-500 bg-neutral-100 font-semibold",
                                        false: "text-slate-600 bg-neutral-200",
                                    };

                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                setFilteredSort(
                                                    el as
                                                        | "Newest to Oldest"
                                                        | "Oldest to Newest"
                                                        | "Alphabetical"
                                                )
                                            }
                                            className={`${stylings[isActive]} transition duration-300 cursor-pointer border-2 px-3 py-2 text-xs w-full flex flex-row justify-between items-center rounded`}
                                        >
                                            <span>{el}</span>

                                            <input
                                                type='radio'
                                                onClick={() =>
                                                    setFilteredSort(
                                                        el as
                                                            | "Newest to Oldest"
                                                            | "Oldest to Newest"
                                                            | "Alphabetical"
                                                    )
                                                }
                                                checked={filteredSort === el}
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    );
                                })}
                            </ul>
                        </article>
                    )}
                </div>
            </header>

            <section className='flex flex-col gap-1'>
                {studentFeedbackCards}
            </section>
        </main>
    );
}
