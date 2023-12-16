export default function StudentFeedbackList() {
    // Fetch feedbacks
    // --> Where:
    // ---> feedback_creator_id === account_id
    // ----> Fetch account_id with email user's email

    return (
        <main className='w-full h-full overflow-x-hidden overflow-y-auto tracking-wider'>
            <header className='p-10'>
                <h1 className='text-3xl font-bold text-slate-800'>
                    Your Feedbacks
                </h1>
            </header>
        </main>
    );
}
