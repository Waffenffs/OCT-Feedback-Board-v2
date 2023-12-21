type TFormInputProps = {
    title: string;
    placeholder?: string;
    type: "text" | "password" | "email";
    value: string;
    name: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormInput({
    title,
    placeholder,
    value,
    onChange,
    name,
}: TFormInputProps) {
    return (
        <div className='w-full flex flex-col gap-1 justify-start text-slate-800'>
            <h1 className='font-semibold tracking-wide'>{title}</h1>
            <input
                type='text'
                placeholder={placeholder !== undefined ? placeholder : ""}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                name={name}
                className='text-sm border-2 border-slate-300 rounded py-1 px-2 focus:outline-blue-500'
            />
        </div>
    );
}
