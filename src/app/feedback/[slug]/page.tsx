"use client";

// import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useEffect } from "react";
// import { useRouter } from "next/router";

export default function Feedback() {
    // features:
    // 1. Creator can make it public/private to other students
    // 2. Only the administrator, creator, and the department can access this feedback.
    // --- > Unless it is public. Feedbacks are private by default

    const supabase = createClientComponentClient();
    // const feedbackId = useSearchParams().get("id");
    // const router = useRouter();

    // const updateURL = async () => {
    //     const { data, error } = await supabase
    //         .from("feedbacks")
    //         .select("feedback_title")
    //         .eq("feedback_id", feedbackId);

    //     if (error) throw error;

    //     const feedbackTitle = data[0].feedback_title

    // };

    // useEffect(() => {
    //     updateURL();
    // }, []);

    return (
        <div className='w-full h-full p-10 bg-white mt-10'>
            <h1>does my internet work right now ?</h1>
        </div>
    );
}
