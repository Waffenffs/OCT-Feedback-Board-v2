import { FaRegQuestionCircle } from "react-icons/fa";

type TPageFlagProps = {
    status: TFeedbackStatus;
};

export default function PageFlag({ status }: TPageFlagProps) {
    const flagProperties = {
        Pending: {
            comment: "This feedback is still pending.",
            stylings: "border-orange-300 bg-orange-100 text-yellow-600",
            icon: <FaRegQuestionCircle className='text-2xl text-yellow-700' />,
        },
        Flagged: {
            comment:
                "This feedback has been flagged as inappropriate and taken down.",
            stylings: "border-red-500 bg-red-100 text-red-600",
            icon: <FaRegQuestionCircle />,
        },
        Resolved: {
            comment:
                "This feedback has been resolved and replies are disabled.",
            stylings: "border-green-500 bg-green-100 text-green-600 ",
            icon: <FaRegQuestionCircle />,
        },
    };

    return (
        <article
            className={`flex flex-row items-center gap-3 w-full mt-32 p-5 border rounded font-semibold text-sm tracking-wider ${flagProperties[status].stylings}`}
        >
            {flagProperties[status].icon}
            <span>{flagProperties[status].comment}</span>
        </article>
    );
}
