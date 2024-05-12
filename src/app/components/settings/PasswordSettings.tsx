"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

import { isValid } from "@/app/utils/helperUtils";

import FormInput from "@/app/components/ui/FormInput";

export default function PasswordSettings({
    accountName,
    loading,
}: {
    accountName: string | undefined;
    loading: boolean;
}) {
    const [changePassword, setChangePassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [
        confirmPasswordChangePressCount,
        setConfirmPasswordChangePressCount,
    ] = useState(0); // Unnecessarily long
    const [error, setError] = useState(false);

    const supabase = createClientComponentClient();

    const handleSubmit = () => {
        const isSamePassword = changePassword === confirmPassword;

        if (!isSamePassword || !isValid(changePassword, "password")) {
            setError(true);

            const unsubscribe = setTimeout(() => {
                setError(false);
            }, 1000);

            return () => {
                console.error("Password is not valid!");
                clearTimeout(unsubscribe);
            };
        } else {
            // Pressed twice, A.K.A confirmed
            if (confirmPasswordChangePressCount === 1) {
                changeUserPassword();
                console.log(
                    `Changed the password: ${confirmPasswordChangePressCount}`
                );
            }

            setConfirmPasswordChangePressCount(1);

            const unsubscribe = setTimeout(() => {
                setConfirmPasswordChangePressCount(0);
            }, 1000);

            return () => clearTimeout(unsubscribe);
        }
    };

    const changeUserPassword = async () => {
        const { error } = await supabase.auth.updateUser({
            password: changePassword,
        });

        if (error) console.error(`Error changing passwords: ${error}`);

        console.log("Successfully changed user password.");

        // Reset states
        setChangePassword("");
        setConfirmPassword("");
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className='bg-white flex flex-col justify-start p-7 text-black mt-5 rounded shadow border w-full'
        >
            {loading ? (
                <div className='h-6 bg-neutral-300 rounded-xl dark:bg-neutral-400 w-64 animate-pulse mb-7'></div>
            ) : (
                <>
                    <div className='mb-7'>
                        <span className='rounded-xl py-1 px-7 bg-neutral-300 text-zinc-700 tracking-wide font-semibold text-sm'>
                            {accountName}
                        </span>
                    </div>
                </>
            )}

            <h1 className='text-xl tracking-wide font-semibold mb-5'>
                Password
            </h1>
            <hr className='w-full h-px mb-5'></hr>

            {/* <div className='flex items-center gap-2 mt-5'>
                <h3 className='font-semibold text-sm'>Change Password</h3>
                <Tooltip content='Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character' />
            </div>
            <input
                name='change-password-input'
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
                className='w-full rounded border-2 border-zinc-300 mt-2 px-2 py-1'
            /> */}

            <div className='flex flex-col items-center gap-5 mb-5'>
                <FormInput
                    name='cp-pass'
                    title='Change Password'
                    type='password'
                    value={changePassword}
                    onChange={setChangePassword}
                />

                <FormInput
                    name='cp-pass2'
                    title='Confirm Password'
                    type='password'
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />
            </div>

            {/* <div className='flex items-center gap-2 mt-5'>
                <h3 className='font-semibold text-sm'>Confirm Password</h3>
                <Tooltip content='Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character' />
            </div>
            <input
                name='confirm-change-password-input'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full rounded border-2 border-zinc-300 mt-2 px-2 py-1'
            /> */}

            <footer className='flex justify-end items-center w-full mt-5'>
                <button
                    onClick={() => handleSubmit()}
                    className={`
                    ${
                        confirmPasswordChangePressCount === 1 || error
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-black border-black hover:bg-blue-500 hover:text-white hover:border-blue-400"
                    } 
                    flex justify-center items-center text-center py-1 px-3 rounded shadow font-semibold border 
                    text-sm transition duration-150 tracking-tight`}
                >
                    {/* cursed */}
                    {error
                        ? "Error"
                        : confirmPasswordChangePressCount === 0
                        ? "Change"
                        : "Confirm"}
                </button>
            </footer>
        </form>
    );
}
