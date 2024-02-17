"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getAccountInfoWithUID } from "@/app/utils/supabaseUtils";

import { useEffect, useState } from "react";

export default function CommentCard(props: TComment) {
    // Tasks:
    // 1. Do some stylish-stylish stuff
    // 2. Maybe memoize feedbackComments state for performance!!!

    const [commentorAccountInfo, setCommentorAccountInfo] =
        useState<TUser | null>(null);

    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchCommentorAccountInfo = async () => {
            const info = await getAccountInfoWithUID(
                supabase,
                props.comment_creator_uid
            );

            console.log(info || "Comments can't be found.");
        };

        fetchCommentorAccountInfo();
    }, []);

    return (
        <article className='rounded-md shadow border flex flex-col justify-start'>
            <span>{}</span>
            <h1>HELLO MADLANG PEOPLE!</h1>
        </article>
    );
}
