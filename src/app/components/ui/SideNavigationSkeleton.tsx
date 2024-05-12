import { IoLogOutOutline } from "react-icons/io5";

export default function SideNavigationSkeleton() {
    return (
        <div className='top-0 max-md:w-screen bg-[#1c1c1c] md:h-screen md:flex flex-col justify-between rounded-tr-xl rounded-br-xl'>
            <div>
                <div className='w-full flex justify-center items-center py-3 px-8 border-b border-neutral-700'>
                    <img src='/oct-logo.png' alt='logo' className='w-20 h-20' />
                </div>

                <div
                    className='hidden md:flex justify-center items-center w-full text-xs py-2 font-semibold text-green-400 
                    border-b border-neutral-700'
                >
                    <div className='flex flex-row items-center gap-1 rounded py-1 px-4 bg-zinc-800'>
                        <span>OlivFeedbacks</span>
                    </div>
                </div>

                <ul className='flex flex-col gap-4 w-full justify-center items-center py-5 '>
                    <div className='px-4 w-full'>
                        <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                    </div>

                    <div className='px-4 w-full'>
                        <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                    </div>

                    <div className='px-4 w-full'>
                        <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                    </div>
                </ul>
            </div>

            <footer
                className='hidden md:flex flex-col gap-3 justify-center items-center py-3 border-t border-neutral-700 
                font-semibold text-xs text-neutral-400'
            >
                <button className='flex flex-row gap-1 items-center'>
                    <IoLogOutOutline className='text-xl' />
                    <span>Sign out</span>
                </button>
            </footer>
        </div>
    );
}
