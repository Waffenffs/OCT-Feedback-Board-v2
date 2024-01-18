type TStatusSectionProps = {
    status: TFeedbackStatus;
    marginTop: number;
};

export default function StatusSection({
    status,
    marginTop,
}: TStatusSectionProps) {
    return (
        <section className={`mt-${marginTop} mb-3`}>
            <h1 className='text-3xl font-bold text-slate-900'>{status}</h1>
            <hr className='h-px mt-4 bg-gray-300 border-0' />
        </section>
    );
}
