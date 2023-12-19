type TStudentFeedbackCardProps = {
    feedback_title: string;
    feedback_description: string;
    feedback_status: "Pending" | "Resolved" | "Flagged";
};

type TFeedbackStatuses = "Pending" | "Resolved" | "Flagged";

export default function StudentFeedbackCard({
    feedback_title,
    feedback_description,
    feedback_status,
}: TStudentFeedbackCardProps) {
    const statusBackgroundColors: Record<TFeedbackStatuses, string> = {
        Pending: "bg-gradient-to-b from-orange-400 to-orange-600",
        Resolved: "bg-gradient-to-b from-green-500 to-green-600",
        Flagged: "bg-gradient-to-b from-red-500 to-red-600",
    };

    return (
        <article className='flex flex-row gap-3 text-slate-700 tracking-wide p-5 bg-white rounded-xl shadow h-52 cursor-pointer hover:-translate-y-3 transition duration-300 ease-in-out'>
            <div className='w-6 pt-1'>
                <div
                    className={`rounded shadow ${statusBackgroundColors[feedback_status]}`}
                >
                    &nbsp;
                </div>
            </div>

            <section>
                <h1 className='font-bold text-lg'>{feedback_title}</h1>
                <p className='text-sm max-w-xs'>{feedback_description}</p>
            </section>
        </article>
    );
}
