"use client";

import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import FormInput from "@/app/components/ui/FormInput";

export default function PasswordSection() {
    // TO-DO:
    // 1. There should be loading state for button

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [
        confirmPasswordChangeClickCount,
        setConfirmPasswordChangeClickCount,
    ] = useState(0);

    const supabase = createClientComponentClient();

    const isSamePassword =
        newPassword === confirmNewPassword && newPassword.length >= 6;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSamePassword) {
            if (confirmPasswordChangeClickCount === 1) {
                // Do the stuff here
                const { error: err } = await supabase.auth.updateUser({
                    password: newPassword,
                });

                if (err) console.error("Error changing the password!");

                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                setConfirmPasswordChangeClickCount(1); // Double-clicked

                const unsubscribe = setTimeout(() => {
                    setConfirmPasswordChangeClickCount(0); // Reset count
                }, 2500);

                return () => clearTimeout(unsubscribe); // To avoid memory leaks
            }
        } else {
            console.error("Invalid password fields! Try again!");
        }
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex flex-col gap-2 justify-start w-80 mt-3 border py-5 px-8 rounded-md bg--100'
        >
            <FormInput
                title='New Password'
                type='password'
                value={newPassword}
                name='new-password'
                onChange={setNewPassword}
            />

            <FormInput
                title='Confirm New Password'
                type='password'
                value={confirmNewPassword}
                name='confirm'
                onChange={setConfirmNewPassword}
            />

            <footer className='w-full flex justify-end items-center mt-4'>
                <button
                    className={`transition duration-150 py-1 px-3 font-semibold rounded ${
                        confirmPasswordChangeClickCount === 0
                            ? "bg-blue-500 hover:bg-blue-600 hover:text-zinc-200"
                            : "bg-green-500"
                    } text-white tracking-wide`}
                >
                    {confirmPasswordChangeClickCount === 0
                        ? "Change"
                        : "Confirm"}
                </button>
            </footer>
        </form>
    );
}
