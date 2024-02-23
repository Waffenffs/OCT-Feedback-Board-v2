"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";

import { IoClose } from "react-icons/io5";
import {
    MdDeleteOutline,
    MdOutlineEdit,
    MdOutlineReport,
} from "react-icons/md";

type TCommentActionsProps = {
    props: TComment;
    close: React.Dispatch<React.SetStateAction<boolean>>;
    status: TFeedbackStatus;
    refComments(): void;
};

type TUserPrivileges = {
    hasEditPrivileges: boolean;
    hasRemovePrivileges: boolean;
};

export default function CommentActions({
    props,
    close,
    status,
    refComments,
}: TCommentActionsProps) {
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [removeCommentPressCount, setRemoveCommentPressCount] = useState(0);
    const [userPrivileges, setUserPrivileges] = useState<TUserPrivileges>({
        hasEditPrivileges: false,
        hasRemovePrivileges: false,
    });
    const [defaultEditCommentValue, setDefaultEditCommentValue] = useState(
        props.comment_content
    );
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchUserPrivileges = async () => {
            const { user } = await getUserInfo(supabase);

            if (!user) {
                console.error("User session does not exist!");
                return;
            }

            const accountInfo = await getAccountInfoWithUID(supabase, user?.id);
            const userIsCommentCreator = user?.id === props.comment_creator_uid;
            const userIsAdministrator =
                accountInfo?.account_type === "Administrator";

            const commentCreatorPrivileges: TUserPrivileges = {
                hasEditPrivileges: true,
                hasRemovePrivileges: true,
            };
            const administratorPrivileges: TUserPrivileges = {
                hasEditPrivileges: false,
                hasRemovePrivileges: true,
            };

            if (userIsCommentCreator) {
                setUserPrivileges(commentCreatorPrivileges);
            } else if (userIsAdministrator) {
                setUserPrivileges(administratorPrivileges);
            }
        };

        fetchUserPrivileges();
    }, []);

    const editComment = async () => {
        const { error: err } = await supabase
            .from("comments")
            .update({ comment_content: defaultEditCommentValue })
            .eq("comment_uid", props.comment_uid);

        if (err) throw err;

        refComments();
        close(false);
    };

    const removeComment = async () => {
        const { error: err } = await supabase
            .from("comments")
            .delete()
            .eq("comment_uid", props.comment_uid);

        if (err) throw err;

        refComments();
        close(false);
    };

    const handleRemoveCommentClick = () => {
        if (removeCommentPressCount === 1) {
            // User has confirmed to delete the comment
            removeComment();

            return;
        }

        setRemoveCommentPressCount(1);

        const unsubscribe = setTimeout(() => {
            setRemoveCommentPressCount(0);
        }, 3000);

        () => clearTimeout(unsubscribe);
    };

    const showOptions = !isEditingComment;

    return (
        <div className='bg-zinc-600/50 fixed top-0 right-0 left-0 flex justify-center items-center w-screen h-screen text-neutral-400'>
            <article className='rounded-xl px-6 py-5 shadow bg-[#1c1c1c] border-2 border-[#3f3f46] w-[32rem]'>
                <header className='flex flex-row w-full justify-between items-center'>
                    <h1 className='font-semibold text-md tracking-wide'>
                        Comment Actions
                    </h1>
                    <button onClick={() => close(false)}>
                        <IoClose className='text-xl text-blue-500' />
                    </button>
                </header>
                <hr className='w-full h-px rounded mt-4 bg-gray-700 border-0' />

                <div className='w-full flex flex-col gap-2 mt-2'>
                    {showOptions ? (
                        <>
                            {userPrivileges.hasEditPrivileges && (
                                <button
                                    disabled={
                                        status === "Resolved" ||
                                        status === "Flagged"
                                    }
                                    onClick={() => {
                                        setIsEditingComment(
                                            (prevState) => !prevState
                                        );
                                    }}
                                    className='bg-zinc-800 text-slate-400 transition delay-100 hover:bg-zinc-700 hover:text-slate-300 text-sm border border-green-700 flex justify-between items-center rounded-md px-4 py-2'
                                >
                                    <span>Edit</span>
                                    <MdOutlineEdit className='text-xl' />
                                </button>
                            )}

                            {userPrivileges.hasRemovePrivileges && (
                                <button
                                    onClick={() => handleRemoveCommentClick()}
                                    className={`transition text-sm border flex justify-between items-center rounded-md px-4 py-2 ${
                                        removeCommentPressCount === 1
                                            ? "text-white bg-red-600 hover:bg-red-700 border-red-500"
                                            : "bg-zinc-800 text-slate-400 hover:bg-zinc-700 hover:text-slate-300 border-green-700"
                                    }`}
                                >
                                    <span className='transition'>
                                        {removeCommentPressCount === 0
                                            ? "Remove"
                                            : "Confirm"}
                                    </span>
                                    <MdDeleteOutline className='text-xl' />
                                </button>
                            )}

                            <button className='bg-zinc-800 text-slate-400 transition delay-100 hover:bg-zinc-700 hover:text-slate-300 text-sm border border-green-700 flex justify-between items-center rounded-md px-4 py-2'>
                                <span>Report</span>
                                <MdOutlineReport className='text-xl' />
                            </button>
                        </>
                    ) : (
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className='text-zinc-200'
                        >
                            <textarea
                                value={defaultEditCommentValue}
                                onChange={(e) =>
                                    setDefaultEditCommentValue(e.target.value)
                                }
                                className='w-full resize-none rounded-md bg-zinc-700 border border-zinc-500 px-3 py-2 whitespace-pre-wrap outline-none'
                                rows={8}
                            />

                            <footer className='w-full flex justify-end items-center gap-3 mt-3'>
                                <button
                                    className='w-20 py-1 px-3 text-sm font-semibold tracking-wide flex justify-center items-center text-center border border-green-500 rounded-md transition duration-100 hover:bg-red-500 hover:border-red-500'
                                    onClick={() => {
                                        setIsEditingComment(false);
                                        setDefaultEditCommentValue(
                                            props.comment_content
                                        ); // Reset back to default value
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => editComment()}
                                    className='w-20 py-1 px-3 text-sm font-semibold tracking-wide flex justify-center items-center text-center bg-blue-500 rounded-md shadow transition duration-100 hover:bg-green-600'
                                >
                                    Update
                                </button>
                            </footer>
                        </form>
                    )}
                </div>
            </article>
        </div>
    );
}
