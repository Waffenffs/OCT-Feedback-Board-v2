"use client";

import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";
import { separateEmailLocalPark } from "@/app/utils/helperUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import PasswordSettings from "@/app/components/settings/PasswordSettings";

import { useEffect, useState } from "react";

type TSettings = {
    user: any | null;
    account: TUser | null;
};

export default function Settings() {
    const [data, setData] = useState<TSettings>({
        user: null,
        account: null,
    });
    const [loading, setLoading] = useState(true);

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

            setLoading(false);
        };

        fetchSettingsData();
    }, []);

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <main className='w-4/6 max-md:w-11/12'>
                <header className='w-full bg-gradient-to-r from-green-500 via-lime-500 to-lime-500 rounded-full shadow py-4 px-7'>
                    <h1 className='text-5xl font-bold tracking-tight text-white'>
                        Settings
                        {/* Settings |{" "}
                        <span className='text-3xl'>
                            {data?.account?.account_name}
                        </span> */}
                    </h1>
                </header>

                {data?.account && (
                    <PasswordSettings
                        accountName={
                            data?.account?.account_username ||
                            separateEmailLocalPark(data?.account?.account_name!)
                        }
                        loading={loading}
                    />
                )}
            </main>
        </div>
    );
}
