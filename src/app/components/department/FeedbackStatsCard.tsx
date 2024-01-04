type TFeedbackStatsCardProps = {
    type: "Pending" | "Resolved" | "Flagged";
    count: number;
};

export default function FeedbackStatsCard({
    type,
    count,
}: TFeedbackStatsCardProps) {}
