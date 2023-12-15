"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import Link from "next/link";

type TAuthenticationProps = {
    mode: "login" | "registration";
};

export default function Authentication({ mode }: TAuthenticationProps) {
    const [authenticationEmail, setAuthenticationEmail] = useState("");
    const [authenticationPassword, setAuthenticationPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    const signUp = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: authenticationEmail,
            password: authenticationPassword,
            // options: {
            //     emailRedirectTo: ''
            // }
        });

        if (error) {
            throw error;
        }

        const { error: accountError } = await supabase.from("accounts").insert([
            {
                account_name: data.user?.email,
                account_type: "Student",
            },
        ]);

        if (accountError) throw accountError;

        setLoading(false);
        router.push("/");
    };

    const signIn = async () => {
        // do something here
    };

    return (
        <main className='w-screen h-screen flex flex-col justify-center items-center tracking-wide bg-slate-200'>
            <form
                action='/auth/callback'
                onSubmit={(e) => e.preventDefault()}
                className='bg-white shadow-xl rounded md:w-96'
            >
                <header className='w-full flex justify-center items-center py-5 bg-orange-400 rounded-t'>
                    <h1 className='text-2xl font-bold'>OlivFeedbacks</h1>
                </header>

                <section className='px-9 py-16'>
                    <div className='w-full flex flex-col justify-start'>
                        <h3 className='text-slate-400 font-semibold text-xs'>
                            Email
                        </h3>
                        <input
                            type='text'
                            className='border py-1 px-3 focus:outline-blue-400 text-slate-500'
                            name='email'
                            value={authenticationEmail}
                            onChange={(e) =>
                                setAuthenticationEmail(e.target.value)
                            }
                        />
                    </div>
                    <div className='w-full flex flex-col justify-start mt-3'>
                        <h3 className='text-slate-400 font-semibold text-xs'>
                            Password
                        </h3>
                        <input
                            type='password'
                            className='border py-1 px-3 focus:outline-blue-400 text-slate-500'
                            name='password'
                            value={authenticationPassword}
                            onChange={(e) =>
                                setAuthenticationPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        onClick={() => (mode === "login" ? signIn() : signUp())}
                        disabled={loading}
                        className={`font-semibold rounded ${
                            loading ? "bg-green-600" : "bg-green-500"
                        } hover:bg-green-600 transition ease-in-out duration-300 text-center w-full py-2 mt-5`}
                    >
                        {mode === "login" ? "Login" : "Register"}
                    </button>
                </section>

                <footer className='w-full flex items-center justify-end px-4 pb-2'>
                    <Link
                        href={mode === "login" ? "/register" : "/login"}
                        className='text-gray-400 font-semibold text-sm'
                    >
                        {mode === "login"
                            ? "Register an account"
                            : "Login with an account"}
                    </Link>
                </footer>
            </form>
        </main>
    );
}
