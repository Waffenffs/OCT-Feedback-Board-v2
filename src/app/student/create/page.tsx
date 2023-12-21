"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import SideNavigation from "@/app/components/ui/SideNavigation";
import UpperNavigation from "@/app/components/ui/UpperNavigation";
import Container from "@/app/components/ui/Container";
import FormInput from "@/app/components/ui/FormInput";

type TDepartment = {
    account_id: number;
    account_name: string;
    account_type: "Department";
    account_uid: string;
};

export default function Create() {
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackDescription, setFeedbackDescription] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("Select");
    const [departmentList, setDepartmentList] = useState<TDepartment[] | null>(
        null
    );

    const supabase = createClientComponentClient();

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            const { data: departments, error } = await supabase
                .from("accounts")
                .select("*")
                .eq("account_type", "Department");

            if (error) throw error;

            setDepartmentList(departments);
        };

        fetchDepartments();
    }, []);

    return (
        <Container stylings='flex flex-row'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full'>
                <div>
                    <UpperNavigation />
                </div>

                <main className='w-full h-full overflow-x-hidden overflow-y-auto flex justify-center items-center'>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className='flex flex-col gap-3 bg-white rounded shadow p-10 w-[35rem]'
                    >
                        <FormInput
                            title='Title'
                            type='text'
                            placeholder='Ex. New Information Technology Supplies'
                            name='feedback_title'
                            value={feedbackTitle}
                            onChange={setFeedbackTitle}
                        />

                        <section>
                            <h1 className='font-semibold tracking-wide text-slate-800'>
                                Description
                            </h1>

                            <textarea
                                className='resize-none overflow-y-hidden text-sm border-2 border-slate-300 rounded w-full py-1 px-2 text-slate-800 focus:outline-blue-500'
                                placeholder='Ex. Students will benefit highly from this...'
                                name='feedback_description'
                                value={feedbackDescription}
                                rows={3}
                                style={{ minHeight: "8rem" }}
                                onChange={(e) => {
                                    setFeedbackDescription(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                            />
                        </section>

                        <footer className='w-full flex flex-col'>
                            <h1 className='font-semibold tracking-wide text-slate-800'>
                                Department
                            </h1>

                            <select
                                value={selectedDepartment}
                                onChange={(e) =>
                                    setSelectedDepartment(e.target.value)
                                }
                                className='py-2 px-3 border-2 border-slate-300 rounded-md text-slate-800 focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500'
                            >
                                {departmentList &&
                                    departmentList.map((department) => (
                                        <option
                                            key={department.account_uid}
                                            value={department.account_type}
                                        >
                                            {department.account_name}
                                        </option>
                                    ))}
                            </select>

                            <div className='pt-8 flex justify-end'>
                                <button className='hover:bg-green-600 hover:border-green-500 hover:text-slate-100 transition duration-300 px-3 py-1 text-sm rounded bg-green-500 border border-green-600 shadow font-semibold text-white tracking-wide'>
                                    Submit
                                </button>
                            </div>
                        </footer>
                    </form>
                </main>
            </div>
        </Container>
    );
}
