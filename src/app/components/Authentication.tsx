"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ChatBubbleSvg from "../../../public/chatbubble.svg";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Container from "./ui/Container";
import FormInput from "./ui/FormInput";

import {
    isValid,
    isEmail,
    separateEmailLocalPark,
} from "@/app/utils/helperUtils";

export type TModes = "login" | "registration" | "department-registration";

type TAuthenticationProps = {
    mode: TModes;
};

export default function Authentication({ mode }: TAuthenticationProps) {
    // # Department
    // octmarketingdepartment.olivarezcollegetagaytay.edu.ph@gmail.com
    // password: latenightattentions
    // ------
    // olivarezaccountingdepartment.olivarezcollegetagaytay.edu.ph@gmail.com
    // password: sampleaccountingaccount
    // ------
    // olivarezmaintenance.olivarezcollegetagaytay.edu.ph@gmail.com
    // password: samplemaintenanceaccount

    // # Student
    // testingstudentaccount@olivarezcollegetagaytay.edu.ph
    // Testing_123

    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [confirmAuthPassword, setConfirmAuthPassword] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleError = () => {
        setLoading(false);
        setAuthError(true);

        const unsubscribe = setTimeout(() => {
            setAuthError(false);
        }, 2500);

        () => clearTimeout(unsubscribe);

        return;
    };

    const signUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
            // options: {
            //     emailRedirectTo: ''
            // }
        });
        if (error) console.error(error);

        const username = separateEmailLocalPark(data.user?.email!);
        const { error: account_error } = await supabase
            .from("accounts")
            .insert([
                {
                    account_name: data.user?.email,
                    account_type: "Student",
                    account_uid: data.user?.id,
                    account_username: username,
                },
            ]);
        if (account_error) {
            throw `Origin app/components/Authentication.tsx >>: ${account_error}`;
        }

        setLoading(false);
        router.push("/");
    };

    const handleSignUp = async () => {
        setLoading(true);

        const passwordIsNotValid = !isValid(authPassword, "password");
        const emailIsNotValid = !isValid(authEmail, "email");
        const isNotSamePassword = authPassword !== confirmAuthPassword;
        const passwordIsEmpty =
            authPassword.length <= 3 || confirmAuthPassword.length <= 3;
        if (
            isNotSamePassword ||
            passwordIsNotValid ||
            emailIsNotValid ||
            passwordIsEmpty
        ) {
            if (emailIsNotValid) {
                console.error(
                    "Invalid email address! Please use the email provided to you by OCT!"
                );
            } else if (isNotSamePassword) {
                console.error("Passwords do not match!");
            } else if (passwordIsNotValid) {
                console.error(
                    "Password must be at least 6 characters and contain 1 uppercase letter and symbol!"
                );
            } else if (passwordIsEmpty) {
                console.error("A password field may be empty!");
            }

            handleError();
        } else {
            // Registration passed all the checks
            signUp();
        }
    };

    const departmentSignUp = async () => {
        setLoading(true);

        const { data, error: signup_error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
        });

        if (signup_error) handleError();

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

        if (isEmail(authEmail)) {
            const { error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: authPassword,
            });

            if (error) handleError();
        } else {
            const { data: userEmail, error } = await supabase
                .from("accounts")
                .select("account_name")
                .eq("account_username", authEmail);
            if (error) handleError();

            if (!userEmail) {
                handleError();
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: userEmail[0].account_name,
                    password: authPassword,
                });

                if (error) handleError();
            }
        }

        setLoading(false);
        router.push("/");
    };

    const authActions: Record<TModes, () => Promise<void>> = {
        login: () => signIn(),
        registration: () => handleSignUp(),
        "department-registration": () => departmentSignUp(),
    };

    return (
        <Container
            stylings='flex max-md:justify-center max-md:items-center max-md:bg-gradient-to-br from-lime-300 to-green-500 
            overflow-auto'
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-lime-300 to-green-500 max-md:hidden'
            >
                <Image src={ChatBubbleSvg} alt='SVG' width={500} height={500} />
                <footer className='flex flex-col text-center mt-12 text-slate-200'>
                    <span className='font-semibold text-3xl italic'>
                        Empowering the Olivarian voice
                    </span>
                    <span className='mt-2'>
                        Made for Olivarians, by Olivarians
                    </span>
                </footer>
            </motion.div>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                action='/auth/callback'
                onSubmit={(e) => e.preventDefault()}
                className='flex flex-col justify-center items-center bg-white shadow-xl w-1/2 relative max-md:rounded-2xl max-md:w-full 
                max-md:py-24'
            >
                <header className='w-full flex flex-row justify-center items-center gap-2 pt-5 rounded-t text-sm font-semibold'>
                    <div
                        className='flex flex-row items-center text-center gap-2 bg-gradient-to-br from-green-500 to-lime-400  rounded-md 
                        text-white'
                    >
                        <h1 className='text-green-500 bg-white px-3 py-1 rounded-md border'>
                            Oliv
                        </h1>
                        <h1 className='pr-3'>Feedbacks</h1>
                    </div>
                </header>

                <section className='w-[28rem] flex flex-col gap-3 px-9 py-10'>
                    {mode === "department-registration" && (
                        <FormInput
                            mode={mode}
                            title='Department Name'
                            placeholder=''
                            type='text'
                            name='department-name'
                            value={departmentName}
                            onChange={setDepartmentName}
                        />
                    )}

                    <FormInput
                        tooltipType='email'
                        mode={mode}
                        title='Email / Username'
                        placeholder=''
                        type='text'
                        name='email-username'
                        value={authEmail}
                        onChange={setAuthEmail}
                    />

                    <FormInput
                        tooltipType='password'
                        mode={mode}
                        title='Password'
                        placeholder=''
                        type='password'
                        name='password'
                        value={authPassword}
                        onChange={setAuthPassword}
                    />

                    {mode === "registration" && (
                        <FormInput
                            tooltipType='password'
                            mode={mode}
                            title='Confirm Password'
                            placeholder=''
                            type='password'
                            name='password'
                            value={confirmAuthPassword}
                            onChange={setConfirmAuthPassword}
                        />
                    )}

                    <button
                        onClick={() => authActions[mode]()}
                        disabled={loading}
                        className={`
                        ${
                            loading
                                ? "bg-green-700 text-slate-200 border-green-400"
                                : "bg-green-500"
                        } 
                        ${
                            authError &&
                            "bg-red-500 border-red-400 hover:bg-red-600"
                        } 

                        text-white font-semibold rounded hover:bg-green-700 hover:text-slate-200 border-2 rounded-full border-green-500 
                        transition ease-in-out duration-300 text-center w-full py-2 mt-16`}
                    >
                        {mode === "login" ? "Login" : "Register"}
                    </button>
                </section>

                <footer className='w-full flex items-center justify-center px-4 pb-2'>
                    <div className='text-gray-400 text-sm flex flex-row items-center text-center gap-1 text-sm tracking-wide'>
                        {mode === "login" ? (
                            <>
                                <span>Are you new?</span>
                                <Link href={"/register"}>
                                    <span className='underline text-green-400 hover:text-green-500'>
                                        Create an account
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <span>Already registered?</span>
                                <Link href={"/login"}>
                                    <span className='underline text-green-400 hover:text-green-500'>
                                        Login with your account
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>
                </footer>
            </motion.form>
        </Container>
    );
}
