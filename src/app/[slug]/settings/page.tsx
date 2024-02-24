import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Settings() {
    const supabase = createServerComponentClient({ cookies });

    const { user } = await getUserInfo(supabase);
    const account = await getAccountInfoWithUID(supabase, user?.id!);

    return (
        <div className='w-full h-full flex justify-center items-center'>
            <article className='w-4/5 bg-white rounded-md shadow-md'>
                <header className='w-full h-40 rounded-t-md bg-gradient-to-r from-green-500 via-lime-500 to-lime-500 flex justify-start items-center pl-5'>
                    <h1 className='text-5xl font-bold tracking-wider text-white italic'>
                        Settings
                    </h1>
                </header>

                <section className='text-slate-700 px-5 py-4'>
                    <h3>{account?.account_name}</h3>
                </section>
            </article>
        </div>
    );
}
