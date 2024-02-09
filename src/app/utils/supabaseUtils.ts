import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserInfo(supabase: SupabaseClient) {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        return { hasSession: !!session, user: session?.user };
    } catch (err) {
        throw err;
    }
}

export async function getFeedbackData(
    supabase: SupabaseClient,
    feedbackId: string
) {
    try {
        const { data: feedbackData } = await supabase
            .from("feedbacks")
            .select("*")
            .eq("feedback_id", feedbackId);

        if (feedbackData) {
            return { ...feedbackData[0] } as TFeedback;
        } else {
            null;
        }
    } catch (error) {
        throw error;
    }
}

export async function getReferencedFeedbacks(
    supabase: SupabaseClient,
    accountID: number
) {
    try {
        const { data: feedbacks } = await supabase
            .from("feedbacks")
            .select("*")
            .eq("feedback_reference", accountID);

        if (feedbacks) {
            return feedbacks as TFeedback[];
        } else {
            null;
        }
    } catch (error) {
        throw error;
    }
}

export async function getAccountInfoWithUID(
    supabase: SupabaseClient,
    accountUID: string
) {
    try {
        const { data: accountInfo } = await supabase
            .from("accounts")
            .select("*")
            .eq("account_uid", accountUID);

        if (accountInfo) {
            return { ...accountInfo[0] } as TUser;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

export async function getAccountInfoWithID(
    supabase: SupabaseClient,
    accountID: number
) {
    try {
        const { data: accountInfo } = await supabase
            .from("accounts")
            .select("*")
            .eq("account_id", accountID);

        if (accountInfo) {
            return { ...accountInfo[0] } as TUser;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

export async function updateFeedbackStatus(
    supabase: SupabaseClient,
    feedbackID: number,
    feedbackStatus: TFeedbackStatus
) {
    try {
        await supabase
            .from("feedbacks")
            .update({ feedback_status: feedbackStatus })
            .eq("feedback_id", feedbackID);
    } catch (error) {
        throw error;
    }
}
