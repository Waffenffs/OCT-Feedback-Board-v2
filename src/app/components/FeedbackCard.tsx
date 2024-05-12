// STATUS: W.I.P. (Do NOT use in production)

"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import Link from "next/link";

import {
    getFormattedDate,
    getStatusBackgroundColor,
} from "@/app/utils/helperUtils";
import { getAccountInfoWithID } from "@/app/utils/supabaseUtils";

import { CiFlag1 } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

interface FeedbackCardProps {
    feedbackType: "department" | "student";
    feedback: TFeedback;

    /* Department props */
    refreshFeedback?(): void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
    feedbackType,
    feedback,
    refreshFeedback,
}) => {
    const [referredDepartmentName, setReferredDepartmentName] = useState<
        string | null
    >(null);
    const [loadingDepartment, setLoadingDepartment] = useState(true);
    const supabase = createClientComponentClient();
    const statusBackgroundColor = getStatusBackgroundColor(
        feedback.feedback_status
    );
    const formattedDate = getFormattedDate(feedback.feedback_created_at);

    const updateFeedback = async (status: TFeedbackStatus) => {
        if (refreshFeedback === undefined) {
            return console.error(
                "Function `updateFeedback` cannot work without props `refreshFeedback`"
            );
        }

        try {
            const { error: err } = await supabase
                .from("feedbacks")
                .update({
                    feedback_status: status,
                    last_reviewed_at: new Date().toISOString(),
                })
                .eq("feedback_id", feedback.feedback_id);
            if (err) throw err;

            refreshFeedback();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchDepartmentName = async () => {
            const accountInfo = await getAccountInfoWithID(
                supabase,
                feedback.feedback_reference
            );
            if (accountInfo === null) {
                return console.error("Error in fetching account info!");
            }

            const departmentName = accountInfo.account_name;

            setReferredDepartmentName(departmentName);
            setLoadingDepartment(false);
        };

        fetchDepartmentName();
    }, []);

    return (
        <article className='flex flex-row gap-3 text-slate-800 tracking-wide p-5 bg-white shadow rounded-md'>
            <div className='w-6 pt-1 relative'>
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
        </article>
    );
};

export default FeedbackCard;
