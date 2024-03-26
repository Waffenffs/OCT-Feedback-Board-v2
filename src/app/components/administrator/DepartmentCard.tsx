"use client";

import { getReferencedFeedbacks } from "@/app/utils/supabaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { getStatusBackgroundColor } from "@/app/utils/helperUtils";

import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

type TDepartmentFeedbackDataProps = {
    total: Record<TFeedbackStatus, number>;
};

export default function DepartmentCard(props: TUser) {
    const supabase = createClientComponentClient();

    const [opened, setOpened] = useState(false);
    const [departmentFeedbackData, setDepartmentFeedbackData] =
        useState<TDepartmentFeedbackDataProps>({
            total: {
                Pending: 0,
                Resolved: 0,
                Flagged: 0,
            },
        });

    const handleOpen = () => {
        setOpened((prevState) => !prevState);
    };

    useEffect(() => {
        const fetchDepartmentFeedbackData = async () => {
            const referencedFeedbacks = await getReferencedFeedbacks(
                supabase,
                props.account_id
            );
            const newDepartmentFeedbackData: TDepartmentFeedbackDataProps = {
                total: {
                    Pending: 0,
                    Resolved: 0,
                    Flagged: 0,
                },
            };
            referencedFeedbacks?.map((feedback) => {
                newDepartmentFeedbackData.total[feedback.feedback_status]++;
            });
            setDepartmentFeedbackData(newDepartmentFeedbackData);
        };

        fetchDepartmentFeedbackData();
    }, []);

    return (
        <article
            onClick={() => handleOpen()}
            className='bg-white rounded shadow-md p-4 cursor-pointer transition hover:shadow-lg transition'
        >
            <section className='w-full flex justify-between items-center'>
                <h1 className='font-semibold text-black'>
                    {props.account_name}
                </h1>
                <div className='text-zinc-400'>
                    {opened ? <FaChevronDown /> : <FaChevronUp />}
                </div>
            </section>

            {opened && (
                <>
                    <section className='w-full flex flex-row justify-around mt-5 gap-3'>
                        {["Pending", "Resolved", "Flagged"].map(
                            (status, index) => (
                                <div
                                    key={index}
                                    className='w-2/6 flex flex-col justify-center items-center gap-1 text-black bg-orange-100 rounded py-2 shadow'
                                >
                                    <header className='flex flex-row items-center gap-2'>
                                        <div
                                            className={`w-3 h-3 rounded-full shadow ${getStatusBackgroundColor(
                                                status as TFeedbackStatus
                                            )}`}
                                        ></div>
                                        <h1 className='tracking-tight'>
                                            {status}
                                        </h1>
                                    </header>
                                    <span>
                                        {
                                            departmentFeedbackData.total[
                                                status as TFeedbackStatus
                                            ]
                                        }
                                    </span>
                                </div>
                            )
                        )}
                    </section>
                    <footer className='w-full flex items-center justify-start mt-8'>
                        <button className='rounded-md py-1 px-3 bg-blue-200 transition hover:bg-blue-300 hover:text-white border-2 border-blue-400 text-blue-500 font-semibold text-sm tracking-wider'>
                            Go-To
                        </button>
                    </footer>
                </>
            )}
        </article>
    );
}
