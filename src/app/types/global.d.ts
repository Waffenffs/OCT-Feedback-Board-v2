export {};

declare global {
    type TFeedbackStatus = "Pending" | "Resolved" | "Flagged";

    type TAccountType = "Department" | "Student" | "Administrator";

    type TSort = "Newest to Oldest" | "Oldest to Newest" | "Alphabetical";

    type TFeedback = {
        feedback_created_at: string;
        feedback_creator_uid: string;
        feedback_description: string;
        feedback_id: string;
        feedback_reference: number;
        feedback_status: TFeedbackStatus;
        feedback_title: string;
    };

    type TUser = {
        account_id: number;
        account_uid: string;
        account_name: string;
        account_type: TAccountType;
    };

    // BELOW are Types that inherit properties from the above
    type TFeedbackStatusWithAll = TFeedbackStatus | "All";
}
