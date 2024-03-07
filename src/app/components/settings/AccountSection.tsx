"use client";

export default function AccountSection() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    // To-Do:
    // 1. Add functionality to delete button

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex flex-col gap-2 justify-start w-80 mt-3 border-2 py-5 px-8 rounded-md bg-neutral-100'
        >
            <div>
                <button className='transition duration-150 py-1 px-3 font-semibold rounded text-white tracking-wide bg-red-500'>
                    Delete Button
                </button>
            </div>
        </form>
    );
}
