"use client";

import { useState } from "react";

import type { TModes } from "@/app/components/Authentication";

import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import Tooltip from "@/app/components/ui/Tooltip";

type TTooltipType = "password" | "email";

type TFormInputProps = {
    title: string;
    placeholder?: string;
    tooltipType?: TTooltipType;
    type: "text" | "password" | "email";
    mode?: TModes;
    value: string;
    name: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormInput(props: TFormInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const tooltipContent: Record<TTooltipType, string> = {
        password:
            "Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character",
        email: "Email must match @olivarezcollegetagaytay.edu.ph",
    };

    return (
        <div className='w-full flex flex-col gap-1 justify-start text-slate-800'>
            <div className='flex flex-row items-center gap-2'>
                <h1 className='font-semibold text-sm'>{props.title}</h1>
                {props.tooltipType &&
                    (props.mode === "registration" ||
                        props.mode === "department-registration") && (
                        <Tooltip content={tooltipContent[props.tooltipType]} />
                    )}
            </div>
            <div className='relative flex flex-row items-center placeholder:text-sm mt-1 text-sm border-2 border-slate-300 rounded py-1 px-2 '>
                <input
                    type={showPassword ? "text" : props.type}
                    placeholder={
                        props.placeholder !== undefined ? props.placeholder : ""
                    }
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    name={props.name}
                    className='w-full focus:outline-none'
                />
                {props.type === "password" && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPassword((prevState) => !prevState);
                        }}
                        className='absolute right-0 text-xl mr-3 transition duration-300'
                    >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                )}
            </div>
        </div>
    );
}
