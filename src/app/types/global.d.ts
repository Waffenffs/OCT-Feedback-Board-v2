export {};

declare global {
    type TFeedbackStatus = "Pending" | "Resolved" | "Flagged";

    type TAccountType = "Department" | "Student" | "Administrator";

    type TSort = "Newest to Oldest" | "Oldest to Newest" | "Alphabetical";

    type TFeedback = {
        feedback_created_at: string;
        feedback_creator_uid: string;
        feedback_description: string;
        feedback_id: number;
        feedback_reference: number;
        feedback_status: TFeedbackStatus;
        feedback_title: string;
        last_reviewed_at: string | null;
    };

    type TComment = {
        feedback_id: number;
        comment_creator_uid: string;
        comment_content: string;
        comment_created_at: string;
        comment_uid: string;
        last_edited_at: string | null;
    };

    type TUser = {
        account_id: number;
        account_uid: string;
        account_name: string;
        account_username?: string;
        account_type: TAccountType;
    };

    // Below are types that inherit properties from the above
    type TFeedbackStatusWithAll = TFeedbackStatus | "All";
}
