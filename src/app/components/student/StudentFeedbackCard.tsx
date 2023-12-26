import Link from "next/link";

type TFeedbackStatuses = "Pending" | "Resolved" | "Flagged";

type TStudentFeedbackCardProps = {
    feedback_id: number | string;
    feedback_title: string;
    feedback_description: string;
    feedback_status: TFeedbackStatuses;
    feedback_created_at: string;
};

export default function StudentFeedbackCard({
    feedback_id,
    feedback_title,
    feedback_description,
    feedback_status,
    feedback_created_at,
}: TStudentFeedbackCardProps) {
    const statusBackgroundColors: Record<TFeedbackStatuses, string> = {
        Pending: "bg-gradient-to-b from-orange-400 to-orange-600",
        Resolved: "bg-gradient-to-b from-green-500 to-green-600",
        Flagged: "bg-gradient-to-b from-red-500 to-red-600",
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const feedbackTimestamp = new Date(feedback_created_at);
    const formattedDate = `Created at ${
        months[feedbackTimestamp.getMonth()]
    } ${feedbackTimestamp.getDay()}, ${feedbackTimestamp.getFullYear()}`;

    return (
        <article className='flex flex-row gap-3 text-slate-800 tracking-wide p-5 bg-white shadow hover:shadow-md transition duration-300 ease-in-out'>
            <div className='h-4 w-6 pt-1 relative'>
                <div
                    className={`group cursor-default rounded shadow ${statusBackgroundColors[feedback_status]}`}
                >
                    &nbsp;
                    <div className='cursor-default absolute -translate-x-5 z-10 flex flex-col opacity-0 group-hover:opacity-100 delay-100 transition-opacity'>
                        <div className='h-3 w-3 origin-bottom-left rotate-45 transform bg-gray-900 self-center'></div>
                        <div className='whitespace-nowrap py-1 px-2 rounded bg-gray-800 bg-gray-900 text-slate-100 tracking-wide text-xs font-semibold'>
                            {feedback_status}
                        </div>
                    </div>
                </div>
            </div>

            <section className='flex flex-col justify-start'>
                <Link
                    href={`/feedback/param?id=${feedback_id}`}
                    className='font-bold text-lg cursor-pointer text-black'
                >
                    {feedback_title}
                </Link>
                <p className='text-sm text-slate-900 truncate w-[45rem]'>
                    {feedback_description}
                </p>
                <section className='mt-3'>
                    <span className='tracking-wider text-sm text-slate-600'>
                        {formattedDate}
                    </span>
                </section>
            </section>
        </article>
    );
}
