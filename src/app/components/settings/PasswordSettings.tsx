"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { isValid } from "@/app/utils/helperUtils";

import Tooltip from "../ui/Tooltip";
import { unsubscribe } from "diagnostics_channel";

export default function PasswordSettings() {
    const [changePassword, setChangePassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordChangePressCount, setConfirmPasswordChangePressCount] = useState(0) // Unnecessarily long 
    const [error, setError] = useState(false);

    const supabase = createClientComponentClient()

    const handleSubmit = () => {
        const isSamePassword = changePassword === confirmPassword

        if (!isSamePassword || !isValid(changePassword, "password")) {
            setError(true)

            const unsubscribe = setTimeout(() => {
                setError(false);
            }, 1500)

            return () => {
                console.error('Password is not valid!')
                clearTimeout(unsubscribe)
            }
        }

        if (confirmPasswordChangePressCount === 1) {
            // Pressed twice, A.K.A confirmed
            changeUserPassword()
        }

        setConfirmPasswordChangePressCount(1)

        const unsubscribe = setTimeout(() => {
            setConfirmPasswordChangePressCount(0)
        }, 1500)

        return () => clearTimeout(unsubscribe)
    }

    const changeUserPassword = async () => {
        // Do something here, for god's sake!
        const { error } = await supabase.auth.updateUser({
            password: changePassword
        })

        if (error) console.error(`Error changing passwords: ${error}`)
    }

    // TO-DO
    // If confirmpasswordchangepresscount is 1, then do make button big red with confirm contents too

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }} className='bg-white flex flex-col justify-start p-7 text-black mt-5 rounded shadow border w-full'>
            <h1 className='text-xl tracking-wide font-semibold mb-5'>
                Password
            </h1>
            <hr className='w-full h-px'></hr>

            <div className="flex items-center gap-2 mt-5">
                <h3 className='font-semibold text-sm'>Change Password</h3>
                <Tooltip content="Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character" />
            </div>
            <input
                name='change-password-input'
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
                className='w-full rounded border-2 border-zinc-300 mt-2 px-2 py-1'
            />

            <div className="flex items-center gap-2 mt-5">
                <h3 className='font-semibold text-sm'>Confirm Password</h3>
                <Tooltip content="Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character" />
            </div>
            <input
                name='confirm-change-password-input'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full rounded border-2 border-zinc-300 mt-2 px-2 py-1'
            />
            <footer className='flex justify-end items-center w-full mt-5'>
                <button onClick={() => handleSubmit()} className={`${(confirmPasswordChangePressCount === 1 || error) ?
                    'bg-red-500 text-white border-red-500' :
                    'bg-white text-black border-black hover:bg-blue-500 hover:text-white hover:border-blue-400'} 
                    flex justify-center items-center text-center py-1 px-3 rounded shadow font-semibold border 
                    text-sm transition duration-150`}>
                    {error
                        ?
                        'Error'
                        :
                        (
                            confirmPasswordChangePressCount === 0 ? "Change" : "Confirm"
                        ) // this is so cursed
                    }
                </button>
            </footer>
        </form>
    );
}
