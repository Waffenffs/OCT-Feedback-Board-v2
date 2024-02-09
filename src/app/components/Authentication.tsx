"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Container from "./ui/Container";
import Link from "next/link";
import FormInput from "./ui/FormInput";

type TModes = "login" | "registration" | "department-registration";

type TAuthenticationProps = {
    mode: TModes;
};

export default function Authentication({ mode }: TAuthenticationProps) {
    // Sample accounts (Accounts will be resetted in final launch):
    // octmarketingdepartment.olivarezcollegetagaytay.edu.ph@gmail.com
    // password: latenightattentions

    const [authenticationEmail, setAuthenticationEmail] = useState("");
    const [authenticationPassword, setAuthenticationPassword] = useState("");
    const [departmentName, setDepartmentName] = useState("");
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

        const userCreds = {
            email: data.user?.email,
            uid: data.user?.id,
        };

        const { error: account_error } = await supabase
            .from("accounts")
            .insert([
                {
                    account_name: userCreds.email, // Initially assign their email as their account name
                    account_type: "Student",
                    account_uid: userCreds.uid, // Their unique identifier
                },
            ]);

        if (account_error)
            throw `Origin app/components/Authentication.tsx >>: ${account_error}`;

        setLoading(false);
        router.push("/");
    };

    const departmentSignUp = async () => {
        setLoading(true);

        const { data, error: signup_error } = await supabase.auth.signUp({
            email: authenticationEmail,
            password: authenticationPassword,
        });

        if (signup_error)
            throw `Origin app/components/Authentication.tsx >>: ${signup_error}`;

        const userUID = data.user?.id;

        const { error: account_error } = await supabase
            .from("accounts")
            .insert([
                {
                    account_name: departmentName,
                    account_type: "Department",
                    account_uid: userUID,
                },
            ]);

        if (account_error)
            throw `Origin app/components/Authentication.tsx >>: ${account_error}`;

        setLoading(false);
        router.push("/");
    };

    const signIn = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: authenticationEmail,
            password: authenticationPassword,
        });

        setLoading(false);

        if (error)
            throw `Origin app/components/Authentication.tsx >>: ${error}`;

        router.push("/");
    };

    const authActions: Record<TModes, () => Promise<void>> = {
        login: () => signIn(),
        registration: () => signUp(),
        "department-registration": () => departmentSignUp(),
    };

    return (
        <Container stylings='flex flex-col justify-center items-center tracking-wide'>
            <form
                action='/auth/callback'
                onSubmit={(e) => e.preventDefault()}
                className='bg-white shadow-xl rounded md:w-96'
            >
                <header className='w-full flex justify-center items-center py-5 bg-[#1c1c1c] rounded-t'>
                    <h1 className='text-2xl font-bold'>OlivFeedbacks</h1>
                </header>

                <section className='flex flex-col gap-3 px-9 py-16'>
                    {mode === "department-registration" && (
                        <FormInput
                            title='Department Name'
                            placeholder=''
                            type='text'
                            name='department-name'
                            value={departmentName}
                            onChange={setDepartmentName}
                        />
                    )}

                    <FormInput
                        title='Email'
                        placeholder=''
                        type='email'
                        name='email'
                        value={authenticationEmail}
                        onChange={setAuthenticationEmail}
                    />

                    <FormInput
                        title='Password'
                        placeholder=''
                        type='password'
                        name='password'
                        value={authenticationPassword}
                        onChange={setAuthenticationPassword}
                    />

                    <button
                        onClick={() => authActions[mode]()}
                        disabled={loading}
                        className={`font-semibold rounded ${
                            loading
                                ? "bg-green-700 text-slate-200 border-green-400"
                                : "bg-green-500"
                        } hover:bg-green-700 hover:text-slate-200 border border-green-500 transition ease-in-out duration-300 text-center w-full py-2 mt-5`}
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
        </Container>
    );
}
