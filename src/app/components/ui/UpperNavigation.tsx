"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { PiStudentFill } from "react-icons/pi";
import { LuBell } from "react-icons/lu";

import Link from "next/link";

import { getUserInfo, getAccountInfoWithUID } from "@/app/utils/supabaseUtils";

export default function UpperNavigation() {
    const [accountName, setAccountName] = useState<string | null>(null);
    const [accountType, setAccountType] = useState<string | null>(null);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { user } = await getUserInfo(supabase);

                const accountInfo = await getAccountInfoWithUID(
                    supabase,
                    user?.id!
                );
                const accountName = accountInfo?.account_name;
                const accountType = accountInfo?.account_type;

                setAccountName(accountName!);
                setAccountType(accountType!);
            } catch (error) {
                console.error(
                    `Error fetching data for upper navigation: ${error}`
                );
            }
        };

        fetchData();
    }, []);

    const userIcons = {
        Student: <PiStudentFill />,
        Department: "",
        Administrator: "",
    };

    if (!accountName || !accountType)
        return (
            <div className='w-full bg-white flex-1 flex justify-end items-center border border-b'>
                <div className='flex flex-col gap-3 py-2 pr-3 animate-pulse h-16'>
                    <div className='h-3 bg-zinc-200 rounded-full dark:bg-zinc-400 w-32 self-end'></div>

                    <div className='h-3 bg-zinc-200 rounded-full dark:bg-zinc-400 w-24 self-end'></div>
                </div>
            </div>
        );

    return (
        <nav className='sticky top-0 z-50 w-full h-16 bg-white flex-1 flex justify-end items-center tracking-wide text-xs border border-b'>
            <section className='flex flex-row items-center gap-6'>
                <Link
                    href={`/${accountType.toLowerCase()}/notifications`}
                    className='text-2xl text-zinc-500'
                >
                    <LuBell />
                </Link>

                <div className='flex flex-col gap-3 py-2 pr-3'>
                    <h2 className='font-semibold text-zinc-500'>
                        {accountName}
                    </h2>

                    <div className='self-end flex flex-row gap-1 items-center text-zinc-100 px-3 py-1 rounded bg-zinc-400'>
                        {userIcons[accountType as TAccountType]}
                        <h3>{accountType}</h3>
                    </div>
                </div>
            </section>
        </nav>
    );
}
