/** Returns formatted date. */
export function getFormattedDate(
    feedback_created_at: string,
    options?: { with_created: boolean }
) {
    let include_with_created;
    if (options !== undefined) {
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

/** Returns corresponding Tailwind CSS colors for given status. */
export function getStatusBackgroundColor(status: TFeedbackStatus) {
    const statusBackgroundColors: Record<TFeedbackStatus, string> = {
        Pending: "bg-gradient-to-b from-orange-400 to-orange-600",
        Resolved: "bg-gradient-to-b from-green-500 to-green-600",
        Flagged: "bg-gradient-to-b from-red-500 to-red-600",
    };
    return statusBackgroundColors[status];
}

/** Returns whether password or email is valid. */
export function isValid(arg: string, mode: "password" | "email") {
    // Must satisfy these criterias:
    // - 1 uppercase letter
    // - 1 special character (non-alphanumeric or underscore)
    // - Minimum 6 characters
    const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    // Must specify this criteria:
    // - Email must match @olivarezcollegetagaytay.edu.ph
    const emailPattern = /.*@olivarezcollegetagaytay\.edu\.ph/i;

    if (mode === "password") {
        return passwordPattern.test(arg);
    }
    if (mode === "email") {
        return emailPattern.test(arg);
    }
}
