import { IoClose } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";

type TCommentActionsProps = {
    props: TComment;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentActions({ props, close }: TCommentActionsProps) {
    // TO-DO:
    // 1. Add edit function
    // 2. Add remove function

    return (
        <div className='bg-zinc-600/50 overflow-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full h-full text-neutral-400'>
            <article className='rounded-xl px-6 py-5 shadow bg-[#1c1c1c] border-2 border-[#3f3f46] w-[26rem]'>
                <header className='flex flex-row w-full justify-between items-center'>
                    <h1 className='font-semibold text-md tracking-wide'>
                        Comment Actions
                    </h1>
                    <button onClick={() => close(false)}>
                        <IoClose className='text-xl text-blue-500' />
                    </button>
                </header>
                <hr className='w-full h-px rounded mt-4 bg-gray-700 border-0' />

                <div className='w-full flex flex-col gap-2 mt-2'>
                    <button className='bg-zinc-800 text-slate-400 transition delay-100 hover:bg-zinc-700 hover:text-slate-300 text-sm border border-green-700 flex justify-between items-center rounded-md px-4 py-2'>
                        <span>Edit Comment</span>
                        <MdOutlineEdit className='text-xl' />
                    </button>
                    <button className='bg-zinc-800 text-slate-400 transition delay-100 hover:bg-zinc-700 hover:text-slate-300 text-sm border border-green-700 flex justify-between items-center rounded-md px-4 py-2'>
                        <span>Remove Comment</span>
                        <MdDeleteOutline className='text-xl' />
                    </button>
                </div>
            </article>
        </div>
    );
}
