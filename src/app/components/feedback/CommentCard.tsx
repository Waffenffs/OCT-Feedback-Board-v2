"use client";

import { getFormattedDate } from "@/app/utils/helperUtils";
import { getAccountInfoWithUID } from "@/app/utils/supabaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useEffect, useState } from "react";

import { BsThreeDots } from "react-icons/bs";

import CommentActions from "./CommentActions";

export default function CommentCard(props: TComment) {
    const [commentorAccountInfo, setCommentorAccountInfo] =
        useState<TUser | null>(null);
    const [commentActionsActive, setCommentActionsActive] = useState(false);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchCommentorAccountInfo = async () => {
            const info = await getAccountInfoWithUID(
                supabase,
                props.comment_creator_uid
            );

            if (!info) {
                console.error("Account does not exist");
                return;
            }

            setCommentorAccountInfo(info);
        };

        fetchCommentorAccountInfo();
    }, []);

    // Add tags like:
    // - Referenced
    // - Administrator
    // - Creator

    return (
        <>
            {commentActionsActive && (
                <CommentActions props={props} close={setCommentActionsActive} />
            )}
            <article className='rounded-md shadow border-2 flex flex-col gap-4 p-2 justify-start bg-zinc-100'>
                <span className='font-semibold'>
                    {commentorAccountInfo?.account_name}
                </span>
                <p className='whitespace-pre'>{props.comment_content}</p>
                <footer className='font-semibold text-zinc-500 text-sm flex flex-row gap-2 items-center text-center mt-4'>
                    <span>
                        {getFormattedDate(props.comment_created_at, false)}
                    </span>
                    <span>|</span>
                    <button onClick={() => setCommentActionsActive(true)}>
                        <BsThreeDots className='text-lg text-blue-500' />
                    </button>
                </footer>
            </article>
        </>
    );
}
