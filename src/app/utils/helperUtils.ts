export function getFormattedDate(
    feedback_created_at: string,
    options?: { with_created: boolean }
) {
    let include_with_created;

    if (options) {
        include_with_created = options.with_created;
    }

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
    const formattedDate = `${months[feedbackTimestamp.getMonth()]} ${
        feedbackTimestamp.getDay() === 0 ? 1 : feedbackTimestamp.getDay()
    }, ${feedbackTimestamp.getFullYear()}`;

    if (include_with_created) {
        return `Created at ${formattedDate}`;
    }
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
