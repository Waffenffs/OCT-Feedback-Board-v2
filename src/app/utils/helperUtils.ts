export function getFormattedDate(feedback_created_at: string) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const feedbackTimestamp = new Date(feedback_created_at);
    const formattedDate = `Created at ${
        months[feedbackTimestamp.getMonth()]
    } ${feedbackTimestamp.getDay()}, ${feedbackTimestamp.getFullYear()}`;

    return formattedDate;
}

export function getStatusBackgroundColor(status: TFeedbackStatus) {
    const statusBackgroundColors: Record<TFeedbackStatus, string> = {
        Pending: "bg-gradient-to-b from-orange-400 to-orange-600",
        Resolved: "bg-gradient-to-b from-green-500 to-green-600",
        Flagged: "bg-gradient-to-b from-red-500 to-red-600",
    };

    return statusBackgroundColors[status];
}
