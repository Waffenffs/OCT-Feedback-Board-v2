"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
    getFormattedDate,
    getStatusBackgroundColor,
} from "@/app/utils/helperUtils";

import Link from "next/link";

import { CiFlag1 } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

type DepartmentFeedbackCardProps = {
    feedback: TFeedback;
    refreshFeedback(): void;
};

export default function DepartmentFeedbackCard({
    feedback,
    refreshFeedback,
}: DepartmentFeedbackCardProps) {
    const supabase = createClientComponentClient();

    const statusBackgroundColor = getStatusBackgroundColor(
        feedback.feedback_status
    );

    const formattedDate = getFormattedDate(feedback.feedback_created_at);

    const updateFeedback = async (status: TFeedbackStatus) => {
        const { error: err } = await supabase
            .from("feedbacks")
            .update({
                feedback_status: status,
                last_reviewed_at: new Date().toISOString(),
            })
            .eq("feedback_id", feedback.feedback_id);

        if (err) throw err;

        refreshFeedback();
    };

    return (
        <article className='flex flex-row gap-3 text-slate-800 tracking-wide p-5 bg-white shadow rounded-md'>
            <div className='h-4 w-6 pt-1 relative'>
                <div
                    className={`group cursor-default rounded shadow ${statusBackgroundColor}`}
                >
                    &nbsp;
                    <div className='cursor-default absolute -translate-x-5 z-10 flex flex-col opacity-0 group-hover:opacity-100 delay-100 transition-opacity'>
                        <div className='h-3 w-3 origin-bottom-left rotate-45 transform bg-gray-900 self-center'></div>
                        <div className='whitespace-nowrap py-1 px-2 rounded bg-gray-800 bg-gray-900 text-slate-100 tracking-wide text-xs font-semibold'>
                            {feedback.feedback_status}
                        </div>
                    </div>
                </div>
            </div>

            <section className='flex flex-col justify-between w-full'>
                <div className='w-full'>
                    <div>
                        <Link
                            href={`/feedback/param?id=${feedback.feedback_id}`}
                            target='_blank'
                            className='font-bold text-lg cursor-pointer text-black'
                        >
                            {feedback.feedback_title}
                        </Link>
                    </div>

                    <p className='text-sm text-slate-900 truncate w-[45rem] overflow-auto'>
                        {feedback.feedback_description}
                    </p>

                    <footer className='mt-8'>
                        <section className='mt-2'>
                            <span className='tracking-wider text-sm text-slate-600'>
                                {formattedDate}
                            </span>
                        </section>
                    </footer>
                </div>

                {feedback.feedback_status === "Pending" && (
                    <div className='mt-3'>
                        <div className='flex flex-row items-center gap-1'>
                            <button
                                onClick={() => updateFeedback("Resolved")}
                                className='flex flex-row justify-center gap-1 items-center text-center w-24 bg-[#1c1c1c] text-sm font-semibold tracking-wide text-white rounded shadow py-1 px-2 transition duration-300 hover:bg-green-600 hover:shadow-green-600'
                            >
                                <IoIosCheckmarkCircleOutline />
                                Resolve
                            </button>
                            <button
                                onClick={() => updateFeedback("Flagged")}
                                className='flex justify-center items-center gap-1 text-center w-24 bg-[#1c1c1c] text-sm font-semibold tracking-wide text-white rounded shadow py-1 px-2 transition duration-300 hover:bg-red-600 hover:shadow-red-600'
                            >
                                <CiFlag1 />
                                Flag
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </article>
    );
}
