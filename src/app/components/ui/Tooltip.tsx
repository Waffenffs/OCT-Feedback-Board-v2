import { MdOutlineQuestionMark } from "react-icons/md";

type TTooltipProps = {
    content: string;
};

export default function Tooltip({ content }: TTooltipProps) {
    return (
        <div className='h-4 w-4 rounded-full flex justify-center items-center text-center bg-zinc-800 text-white group relative'>
            <MdOutlineQuestionMark className='text-xs' />
            <div className='cursor-default absolute translate-y-6 -translate-x-0.5 z-10 flex flex-col hidden group-hover:flex'>
                <div className='h-3 w-3 origin-bottom-left rotate-45 transform bg-zinc-800 self-center'></div>
                <div className='whitespace-nowrap py-1 px-2 rounded bg-gray-800 bg-zinc-800 text-slate-100 tracking-wide text-xs font-semibold'>
                    {content}
                </div>
            </div>
        </div>
    );
}
