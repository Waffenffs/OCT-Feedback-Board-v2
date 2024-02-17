import { FiMessageSquare } from "react-icons/fi";
import { useState } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getUserInfo } from "@/app/utils/supabaseUtils";

type TCommentInputProps = {
    status: TFeedbackStatus;
    feedbackId: number;
};

export default function CommentInput({
    status,
    feedbackId,
}: TCommentInputProps) {
    const [loading, setLoading] = useState(false);
    const [commentContent, setCommentContent] = useState("");

    const supabase = createClientComponentClient();

    const isDisabled = status === "Flagged" || status === "Resolved" || loading;
    const buttonStyling = isDisabled
        ? "cursor-not-allowed hover:bg-red-600"
        : "hover:bg-blue-500";

    const sendComment = async () => {
        setLoading(true);

        const { user } = await getUserInfo(supabase);

        const comment = {
            feedback_id: feedbackId,
            comment_content: commentContent,
            comment_creator_uid: user?.id,
        };

        const { error: submissionError } = await supabase
            .from("comments")
            .insert(comment);

        if (submissionError) throw submissionError;

        setCommentContent(""); // Reset input
        setLoading(false);

        console.log("Successfully submitted comment!");
    };

    // To - do
    // 1. Display comments in column layout (sorted from oldest to newest)
    // 2. Do this weird stuff where whitespaces don't get ignored

    return (
        <section className='px-10'>
            <header className='flex flex-row items-center gap-1'>
                <FiMessageSquare />
                <h1 className='font-semibold tracking-wide'>Your Message</h1>
            </header>

            <textarea
                disabled={isDisabled}
                placeholder='Insert your thoughts here...'
                className={`w-full py-1 px-2 mt-1 border-2 rounded resize-none ${
                    isDisabled && `cursor-not-allowed`
                }`}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
            />

            <footer className='w-full flex mt-3 justify-end items-center'>
                <button
                    onClick={() => sendComment()}
                    disabled={isDisabled}
                    className={`rounded font-semibold py-1 px-3 tracking-wide bg-zinc-900 text-white ${buttonStyling}`}
                >
                    Send
                </button>
            </footer>
        </section>
    );
}