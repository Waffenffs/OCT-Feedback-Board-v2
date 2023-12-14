"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Link from "next/link";

type TAuthenticationProps = {
    mode: "login" | "registration";
};

export default function Authentication({ mode }: TAuthenticationProps) {
    const [authenticationEmail, setAuthenticationEmail] = useState("");
    const [authenticationPassword, setAuthenticationPassword] = useState("");

    const supabase = createClientComponentClient();

    const signUp = async () => {
        // do something here
        // When user signs up, by default, assign them a student status
        // Department sign-up will be handled by the admin/in a hidden URL
    };

    const signIn = async () => {
        // do something here
    };

    return (
        <main className='w-screen h-screen flex flex-col justify-center items-center tracking-wide bg-slate-200'>
            <form
                action='/auth/callback'
                onSubmit={(e) => e.preventDefault()}
                className='bg-white shadow-xl rounded'
            >
                <header className='w-full flex justify-center items-center py-5 bg-blue-400 rounded-t'>
                    <h1 className='text-2xl font-bold'>OlivFeedbacks</h1>
                </header>

                <section className='px-12 py-10'>
                    <div className='w-full flex flex-col justify-start'>
                        <h3 className='text-slate-400 font-semibold text-xs'>
                            Email
                        </h3>
                        <input
                            type='text'
                            placeholder='account@olivarezcollegetagaytay.edu.ph'
                            className='border py-1 px-3 focus:outline-blue-400'
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
                            className='border py-1 px-3 focus:outline-blue-400'
                            name='password'
                            value={authenticationPassword}
                            onChange={(e) =>
                                setAuthenticationPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        onClick={() => (mode === "login" ? signIn() : signUp())}
                        className='font-semibold rounded bg-green-500 text-center w-full py-2 mt-5'
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
