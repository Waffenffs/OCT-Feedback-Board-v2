import type { SupabaseClient } from "@supabase/supabase-js";

/** Gets the session of the logged in user. */
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

/** Gets the data of a feedback using their `feedback_id` property. */
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

/** Gets referenced feedbacks data for department users through their `account_id` property. */
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

/** Gets the data of a user using their `account_uid` property. */
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

/** Gets the data of a user using their `account_id` property. */
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

/** Returns the credentials of a feedback given their ID */
export async function fetchFeedbackCredentials(
    supabase: SupabaseClient,
    feedbackID: number
) {
    const { data, error } = await supabase
        .from("feedbacks")
        .select("feedback_creator_uid, feedback_reference")
        .eq("feedback_id", feedbackID);

    if (error) throw error;

    const feedbackCredentials = {
        feedback_creator_uid: data[0]?.feedback_creator_uid,
        feedback_reference: data[0]?.feedback_reference,
    };

    return feedbackCredentials;
}

/** Returns the credentials of current user  */
export async function fetchUserCredentials(supabase: SupabaseClient) {
    const {
        data: { session },
        error: error_one,
    } = await supabase.auth.getSession();
    if (error_one) throw error_one;

    const user = session?.user;

    const { data: user_credentials, error: error_two } = await supabase
        .from("accounts")
        .select("account_id, account_uid, account_type")
        .eq("account_uid", user?.id);
    if (error_two) throw error_two;

    const userCredentials = {
        account_id: user_credentials[0]?.account_id,
        account_uid: user_credentials[0]?.account_uid,
        account_type: user_credentials[0]?.account_type as TAccountType,
    };

    return userCredentials;
}
