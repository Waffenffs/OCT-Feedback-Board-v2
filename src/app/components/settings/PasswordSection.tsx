"use client";

import { useState } from "react";

import FormInput from "@/app/components/ui/FormInput";

export default function PasswordSection() {
    const [userPassword, setUserPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // todo:
    // 1. add some stylings, PLEASE

    // Feats:
    // --> If confirmNewPassword != newPassword > invalid
    // --> If userPassword is falsey > invalid

    return (
        <section className='flex flex-col gap-2 justify-start w-80 mt-3'>
            <FormInput
                title='Your Password'
                type='password'
                value={userPassword}
                name='your-password'
                onChange={setUserPassword}
            />

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
        </section>
    );
}
