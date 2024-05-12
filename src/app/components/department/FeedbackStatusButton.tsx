type TFeedbackStatusButtonProps = {
    set: React.Dispatch<React.SetStateAction<TFeedbackStatus>>;
    length: number;
    status: TFeedbackStatus;
    activeStatus: TFeedbackStatus;
};

export default function FeedbackStatusButton(
    props: TFeedbackStatusButtonProps
) {
    return (
        <button
            onClick={() => props.set(props.status)}
            className={`${
                props.activeStatus === props.status
                    ? "bg-green-300 border-green-400"
                    : "hover:bg-gray-300"
            } border group rounded-2xl transition flex flex-row items-center gap-2 p-3 `}
        >
            <h1
                className={`font-bold ${
                    props.activeStatus === props.status &&
                    "text-slate-900 group-hover:text-slate-600"
                } text-3xl text-slate-600 transition duration-300 group-hover:text-slate-500`}
            >
                {props.status}
            </h1>
            <div className='w-8 h-8 flex justify-center items-center text-center bg-blue-400 rounded-full'>
                <span>{props.length}</span>
            </div>
        </button>
    );
}
