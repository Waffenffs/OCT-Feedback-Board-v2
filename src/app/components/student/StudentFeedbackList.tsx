"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import StudentFeedbackCard from "./StudentFeedbackCard";
import FilterMenu from "../ui/FilterMenu";

export type TFeedbackStatus = "Pending" | "Resolved" | "Flagged" | "All";
export type TSort = "Newest to Oldest" | "Oldest to Newest" | "Alphabetical";

export default function StudentFeedbackList() {
    const [feedbacks, setFeedbacks] = useState<any | null>(null);
    const [isActiveFilterMenu, setIsActiveFilterMenu] = useState(false);
    const [activeCategory, setActiveCategory] =
        useState<TFeedbackStatus>("All");
    const [activeSort, setActiveSort] = useState<TSort>("Newest to Oldest");
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClientComponentClient();

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

            let filteredFeedbacks = feedbacksData || [];

            if (activeCategory) {
                filteredFeedbacks = filterByStatus(
                    feedbacksData,
                    activeCategory
                );
            }

            if (activeSort) {
                filteredFeedbacks = sortByDate(filteredFeedbacks, activeSort);
            }

            setFeedbacks(filteredFeedbacks);
            setIsLoading(false);
        } catch (error) {
            console.error(`Error fetching data for feedback list: ${error}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filterByStatus = (
        feedbacks: any[],
        status: TFeedbackStatus
    ): any[] => {
        if (status === "All") {
            return feedbacks;
        }

        return feedbacks.filter(
            (feedback) => feedback.feedback_status === status
        );
    };

    const sortByDate = (feedbacks: any[], sort: TSort): any[] => {
        const sorted = feedbacks.slice();

        switch (sort) {
            case "Newest to Oldest":
                sorted.sort(
                    (a, b) =>
                        new Date(b.feedback_created_at).getTime() -
                        new Date(a.feedback_created_at).getTime()
                );
                break;
            case "Oldest to Newest":
                sorted.sort(
                    (a, b) =>
                        new Date(a.feedback_created_at).getTime() -
                        new Date(b.feedback_created_at).getTime()
                );
                break;
            case "Alphabetical":
                sorted.sort((a, b) =>
                    a.feedback_title.localeCompare(b.feedback_title)
                );
        }

        return sorted;
    };

    const handleApplyFilters = () => {
        setIsLoading(true);
        setIsActiveFilterMenu(false);

        fetchData();
    };

    if (isLoading)
        return (
            <main className='w-full h-full p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-8 animate-pulse'>
                <section className='flex flex-col gap-1'>
                    <header className='mb-10 w-full flex justify-between items-center'>
                        <div className='h-10 bg-zinc-200 rounded-full dark:bg-zinc-400 w-60'></div>
                        <div className='h-5 bg-zinc-200 rounded-full dark:bg-zinc-400 w-16'></div>
                    </header>

                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
                    <div className='h-36 bg-zinc-200 rounded dark:bg-zinc-400 w-full'></div>
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
                feedback_reference={feedback.feedback_reference}
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
                            setIsActiveFilterMenu((prevState) => !prevState)
                        }
                        className='text-sm text-blue-500 font-semibold'
                    >
                        Filter
                    </button>

                    {isActiveFilterMenu && (
                        <FilterMenu
                            setIsActiveFilterMenu={setIsActiveFilterMenu}
                            activeCategory={activeCategory}
                            activeSort={activeSort}
                            setActiveCategory={setActiveCategory}
                            setActiveSort={setActiveSort}
                            handleApplyFilters={handleApplyFilters}
                        />
                    )}
                </div>
            </header>

            <section className='flex flex-col gap-1'>
                {studentFeedbackCards}
            </section>
        </main>
    );
}
