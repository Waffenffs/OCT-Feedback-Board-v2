"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";

type TFeedbackStatuses = "Pending" | "Resolved" | "Flagged";

type TStudentFeedbackCardProps = {
    feedback_id: number | string;
    feedback_title: string;
    feedback_description: string;
    feedback_status: TFeedbackStatuses;
    feedback_created_at: string;
    feedback_reference: number;
};

export default function StudentFeedbackCard({
    feedback_id,
    feedback_title,
    feedback_description,
    feedback_status,
    feedback_created_at,
    feedback_reference,
}: TStudentFeedbackCardProps) {
    const [referredDepartmentName, setReferredDepartmentName] = useState<
        string | null
    >(null);
    const [loadingDepartment, setLoadingDepartment] = useState(true);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchDepartmentName = async () => {
            const { data, error } = await supabase
                .from("accounts")
                .select("account_name")
                .eq("account_id", feedback_reference);

            if (error) throw error;

            const departmentName = data[0].account_name;

            setReferredDepartmentName(departmentName);
            setLoadingDepartment(false);
        };

        fetchDepartmentName();
    }, []);

    const statusBackgroundColors: Record<TFeedbackStatuses, string> = {
        Pending: "bg-gradient-to-b from-orange-400 to-orange-600",
        Resolved: "bg-gradient-to-b from-green-500 to-green-600",
        Flagged: "bg-gradient-to-b from-red-500 to-red-600",
    };

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

    const feedbackTimestamp = new Date(feedback_created_at);
    const formattedDate = `Created at ${
        months[feedbackTimestamp.getMonth()]
    } ${feedbackTimestamp.getDay()}, ${feedbackTimestamp.getFullYear()}`;

    return (
        <article className='flex flex-row gap-3 text-slate-800 tracking-wide p-5 bg-white shadow hover:shadow-md transition duration-300 ease-in-out'>
            <div className='h-4 w-6 pt-1 relative'>
                <div
                    className={`group cursor-default rounded shadow ${statusBackgroundColors[feedback_status]}`}
                >
                    &nbsp;
                    <div className='cursor-default absolute -translate-x-5 z-10 flex flex-col opacity-0 group-hover:opacity-100 delay-100 transition-opacity'>
                        <div className='h-3 w-3 origin-bottom-left rotate-45 transform bg-gray-900 self-center'></div>
                        <div className='whitespace-nowrap py-1 px-2 rounded bg-gray-800 bg-gray-900 text-slate-100 tracking-wide text-xs font-semibold'>
                            {feedback_status}
                        </div>
                    </div>
                </div>
            </div>

            <section className='flex flex-col justify-start w-full'>
                <div>
                    <Link
                        href={`/feedback/param?id=${feedback_id}`}
                        className='font-bold text-lg cursor-pointer text-black'
                    >
                        {feedback_title}
                    </Link>
                </div>

                <p className='text-sm text-slate-900 truncate w-[45rem]'>
                    {feedback_description}
                </p>

                <footer className='mt-8'>
                    {referredDepartmentName ? (
                        <span className='tracking-wider text-sm text-slate-600 bg-neutral-200 py-1 px-3 rounded'>
                            Regarding: {referredDepartmentName}
                        </span>
                    ) : (
                        <div className='h-5 mt-3 bg-zinc-200 rounded dark:bg-zinc-400 w-48 animate-pulse'></div>
                    )}

                    <section className='mt-2'>
                        <span className='tracking-wider text-sm text-slate-600'>
                            {formattedDate}
                        </span>
                    </section>
                </footer>
            </section>
        </article>
    );
}
