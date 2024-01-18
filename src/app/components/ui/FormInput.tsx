type TFormInputProps = {
    title: string;
    placeholder?: string;
    type: "text" | "password" | "email";
    value: string;
    name: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function FormInput(props: TFormInputProps) {
    return (
        <div className='w-full flex flex-col gap-1 justify-start text-slate-800'>
            <h1 className='font-semibold tracking-wide'>{props.title}</h1>
            <input
                type={props.type}
                placeholder={
                    props.placeholder !== undefined ? props.placeholder : ""
                }
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                name={props.name}
                className='mt-1 text-sm border-2 border-slate-300 rounded py-1 px-2 focus:outline-none focus:border-blue-500'
            />
        </div>
    );
}
