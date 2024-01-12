import FeedbackStatsOverview from "../components/department/FeedbackStatsOverview";

export default function Department() {
    return (
        <main className='w-full h-full p-10'>
            <FeedbackStatsOverview />
            <h1 className='text-3xl font-bold text-slate-900 mt-14'>Pending</h1>
            <hr className='h-px mt-4 bg-gray-300 border-0' />

            <h1 className='text-3xl font-bold text-slate-900 mt-14'>
                Resolved
            </h1>
            <hr className='h-px mt-4 bg-gray-300 border-0' />

            <h1 className='text-3xl font-bold text-slate-900 mt-14'>Flagged</h1>
            <hr className='h-px mt-4 bg-gray-300 border-0' />
        </main>
    );
}
