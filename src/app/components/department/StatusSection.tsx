type TStatusSectionProps = {
    status: TFeedbackStatus;
    marginTop?: number;
    feedbackCount?: number;
};

export default function StatusSection({
    status,
    marginTop,
    feedbackCount,
}: TStatusSectionProps) {
    return (
        <section className={`mt-${marginTop} mb-3`}>
            <div className={`flex flex-row items-center gap-2`}>
                <h1 className='text-3xl font-bold text-slate-900'>{status}</h1>
                <div className='w-8 h-8 flex justify-center items-center text-center bg-blue-400 rounded-full'>
                    <span>{feedbackCount}</span>
                </div>
            </div>
            <hr className='h-px mt-4 bg-gray-300 border-0' />
        </section>
    );
}
