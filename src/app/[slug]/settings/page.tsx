"use client";

import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import PasswordSettings from "@/app/components/settings/PasswordSettings";

import { useEffect, useState } from "react";

type TSettings = {
    user: any | null;
    account: TUser | null;
};

type TCurrentSetting = "Password" | "Account" | "FAQ";

export default function Settings() {
    const [data, setData] = useState<TSettings>({
        user: null,
        account: null,
    });
    const [currentSetting, setCurrentSetting] =
        useState<TCurrentSetting>("Password");

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchSettingsData = async () => {
            const { user } = await getUserInfo(supabase);

            if (!user)
                return console.error(`Error fetching settings data: ${user}`);

            const account = await getAccountInfoWithUID(supabase, user?.id);

            setData({
                user: user,
                account: account,
            });
        };

        fetchSettingsData();
    }, []);

    const settingComponents: Record<TCurrentSetting, React.JSX.Element> = {
        Password: <PasswordSettings />,
        Account: <></>,
        FAQ: <></>,
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <main className='w-4/6'>
                <header className='w-full bg-gradient-to-r from-green-500 via-lime-500 to-lime-500 rounded-full shadow py-4 px-7'>
                    <h1 className='text-5xl font-bold tracking-tight text-white'>
                        Settings |{" "}
                        <span className='text-3xl'>
                            {data?.account?.account_name}
                        </span>
                    </h1>
                </header>

                <div className='flex flex-row justify-start items-center gap-2 mt-5'>
                    {["Password", "FAQ", "Account"].map((val, index) => (
                        <div
                            key={index}
                            className={`${
                                val === currentSetting
                                    ? "bg-blue-500 text-white hover:bg-blue-600 border border-blue-400"
                                    : "bg-white text-black hover:bg-blue-500 hover:text-white"
                            } cursor-pointer transition duration-200 shadow flex justify-center items-center text-center font-semibold  w-20 py-1 px-7 rounded text-sm semibold rounded-xl`}
                        >
                            {val}
                        </div>
                    ))}
                </div>

                {settingComponents[currentSetting]}
            </main>
        </div>
    );
}
