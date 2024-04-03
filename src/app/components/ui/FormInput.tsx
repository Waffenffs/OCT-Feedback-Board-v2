import type { TModes } from "@/app/components/Authentication";

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
    const tooltipContent: Record<TTooltipType, string> = {
        password:
            "Password must have a minimum of 6 characters with 1 uppercase letter and 1 special character",
        email: "Email must match @olivarezcollegetagaytay.edu.ph",
    };

    return (
        <div className='w-full flex flex-col gap-1 justify-start text-slate-800'>
            <div className='flex flex-row items-center gap-2'>
                <h1 className='font-semibold tracking-wide text-sm'>
                    {props.title}
                </h1>
                {props.tooltipType &&
                    (props.mode === "registration" ||
                        props.mode === "department-registration") && (
                        <Tooltip content={tooltipContent[props.tooltipType]} />
                    )}
            </div>
            <input
                type={props.type}
                placeholder={
                    props.placeholder !== undefined ? props.placeholder : ""
                }
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                name={props.name}
                className='placeholder:text-sm mt-1 text-sm border-2 border-slate-300 rounded py-1 px-2 focus:outline-none focus:border-blue-500'
            />
        </div>
    );
}
