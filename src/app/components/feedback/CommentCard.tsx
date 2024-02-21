"use client";

import { getFormattedDate } from "@/app/utils/helperUtils";
import { getAccountInfoWithUID } from "@/app/utils/supabaseUtils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useEffect, useState } from "react";

import { BsThreeDots } from "react-icons/bs";

import CommentActions from "./CommentActions";

type TCommentCardProps = {
    props: TComment;
    status: TFeedbackStatus;
};

export default function CommentCard({ props, status }: TCommentCardProps) {
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

    const commentorTag: Record<TAccountType, string> = {
        Department: "Referenced Department",
        Student: "OP",
        Administrator: "Admin",
    };

    return (
        <>
            {commentActionsActive && (
                <CommentActions
                    props={props}
                    close={setCommentActionsActive}
                    status={status}
                />
            )}
            <article className='rounded-md shadow border-2 flex flex-col p-2 justify-start bg-zinc-100'>
                <div className='flex flex-row items-center justify-start w-full gap-2'>
                    <span className='font-semibold'>
                        {commentorAccountInfo?.account_name}
                    </span>

                    <article className='rounded-md px-2 py-1 bg-zinc-300 border flex justify-center items-center text-center'>
                        <span className='text-xs text-blue-500 font-semibold tracking-wide'>
                            {commentorTag[commentorAccountInfo?.account_type!]}
                        </span>
                    </article>
                </div>
                <hr className='w-full h-2 mt-2'></hr>
                <p className='whitespace-pre mt-4'>{props.comment_content}</p>
                <hr className='w-full h-2 mt-5'></hr>
                <footer className='font-semibold text-zinc-500 text-sm flex flex-row gap-2 items-center text-center'>
                    <span>{getFormattedDate(props.comment_created_at)}</span>
                    <span>|</span>
                    <button onClick={() => setCommentActionsActive(true)}>
                        <BsThreeDots className='text-lg text-blue-500' />
                    </button>
                </footer>
            </article>
        </>
    );
}
