"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getAccountInfoWithUID } from "@/app/utils/supabaseUtils";
import { getFormattedDate } from "@/app/utils/helperUtils";

import { useEffect, useState } from "react";

export default function CommentCard(props: TComment) {
    const [commentorAccountInfo, setCommentorAccountInfo] =
        useState<TUser | null>(null);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchCommentorAccountInfo = async () => {
            const info = await getAccountInfoWithUID(
                supabase,
                props.comment_creator_uid
            );

            // Check if account info exists
            if (!info) {
                console.error("Account does not exist");
                return;
            }

            setCommentorAccountInfo(info);

            console.log(`Account info: ${info}`);
        };

        fetchCommentorAccountInfo();
    }, []);

    return (
        <article className='rounded-md shadow border flex flex-col gap-4 p-2 justify-start'>
            <span className='font-semibold'>
                {commentorAccountInfo?.account_name}
            </span>
            <p className='whitespace-pre'>{props.comment_content}</p>
            <footer className='font-semibold text-zinc-500 text-sm'>
                {getFormattedDate(props.comment_created_at)}
            </footer>
        </article>
    );
}
