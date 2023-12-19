"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { PiStudentFill } from "react-icons/pi";
import { LuBell } from "react-icons/lu";

import Link from "next/link";

export default function UpperNavigation() {
    const [accountName, setAccountName] = useState<string | null>(null);
    const [accountType, setAccountType] = useState<string | null>(null);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                setAccountName(user?.email as string);

                const { data: accountData } = await supabase
                    .from("accounts")
                    .select("account_type")
                    .eq("account_name", user?.email);

                if (accountData && accountData.length > 0) {
                    setAccountType(accountData[0].account_type);
                }
            } catch (error) {
                console.error(
                    `Error fetching data for upper navigation: ${error}`
                );
            }
        };

        fetchData();
    }, []);

    if (!accountName || !accountType) return <>Loading...</>;

    const userIcons = {
        Student: <PiStudentFill />,
        Department: "",
        Administrator: "",
    };

    return (
        <nav className='w-full bg-white flex-1 flex justify-end items-center tracking-wide text-xs border border-b'>
            <section className='flex flex-row items-center gap-6'>
                <Link
                    href={`/${accountType.toLowerCase()}/notifications`}
                    className='text-2xl text-zinc-500'
                >
                    <LuBell />
                </Link>

                <div className='flex flex-col gap-3 py-2 pr-3'>
                    <h2 className='font-semibold text-zinc-500 blur hover:blur-0 bg-neutral-300 rounded transition duration-300 ease-in-out hover:bg-white'>
                        {accountName}
                    </h2>
                    <div className='self-end flex flex-row gap-1 items-center text-zinc-100 px-3 py-1 rounded bg-zinc-400'>
                        {
                            userIcons[
                                accountType as
                                    | "Student"
                                    | "Department"
                                    | "Administrator"
                            ]
                        }
                        <h3>{accountType}</h3>
                    </div>
                </div>
            </section>
        </nav>
    );
}
