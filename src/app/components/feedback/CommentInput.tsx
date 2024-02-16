import { FiMessageSquare } from "react-icons/fi";

type TCommentInputProps = {
    status: TFeedbackStatus;
};

export default function CommentInput({ status }: TCommentInputProps) {
    const isDisabled = status === "Flagged" || status === "Resolved";
    const buttonStyling = isDisabled
        ? "cursor-not-allowed hover:bg-red-600"
        : "hover:bg-blue-500";

    return (
        <section className='px-10'>
            <header className='flex flex-row items-center gap-1'>
                <FiMessageSquare />
                <h1 className='font-semibold tracking-wide'>Your Message</h1>
            </header>

            <textarea
                disabled={isDisabled}
                placeholder='Insert your thoughts here...'
                className={`w-full py-1 px-2 mt-1 border-2 rounded resize-none ${isDisabled && `cursor-not-allowed`}`}
                rows={4}
            />

            <footer className='w-full flex mt-3 justify-end items-center'>
                <button
                    disabled={isDisabled}
                    className={`rounded font-semibold py-1 px-3 tracking-wide bg-zinc-900 text-white ${buttonStyling}`}
                >
                    Send
                </button>
            </footer>
        </section>
    );
}
