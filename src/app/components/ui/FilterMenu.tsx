import { useDetectClickOutside } from "react-detect-click-outside";

import type { TFeedbackStatus, TSort } from "../student/StudentFeedbackList";

type TFilterMenuProps = {
    setIsActiveFilterMenu: React.Dispatch<React.SetStateAction<boolean>>;
    activeCategory: TFeedbackStatus;
    setActiveCategory: React.Dispatch<React.SetStateAction<TFeedbackStatus>>;
    activeSort: TSort;
    setActiveSort: React.Dispatch<React.SetStateAction<TSort>>;
    handleApplyFilters(): void;
};

export default function FilterMenu({
    setIsActiveFilterMenu,
    activeCategory,
    setActiveCategory,
    activeSort,
    setActiveSort,
    handleApplyFilters,
}: TFilterMenuProps) {
    const activeStyles =
        "border-blue-400 text-blue-500 bg-neutral-100 font-semibold";
    const inactiveStyles = "text-slate-600 bg-neutral-200";

    const ref = useDetectClickOutside({
        onTriggered: () => setIsActiveFilterMenu(false),
    });

    return (
        <article
            ref={ref}
            className='z-50 absolute -translate-x-[26rem] mt-1 bg-[#1c1c1c] rounded shadow-xl px-5 py-3'
        >
            <section>
                <h2 className='text-lg text-green-500 font-bold'>Categories</h2>
                <ul className='flex flex-row justify-start gap-3 mt-2 rounded'>
                    {["All", "Pending", "Resolved", "Flagged"].map(
                        (el, index) => {
                            const currentStylings =
                                el === activeCategory
                                    ? activeStyles
                                    : inactiveStyles;

                            return (
                                <ul
                                    key={index}
                                    onClick={() =>
                                        setActiveCategory(el as TFeedbackStatus)
                                    }
                                    className={`${currentStylings} text-xs transition duration-100 cursor-pointer w-24 py-1 px-3 rounded-full border-2 text-sm text-center`}
                                >
                                    <span>{el}</span>
                                </ul>
                            );
                        }
                    )}
                </ul>
            </section>

            <section>
                <h2 className='text-lg text-green-500 font-bold mt-5'>Sort</h2>
                <ul className='flex flex-col gap-1 mt-2 w-full'>
                    {[
                        "Newest to Oldest",
                        "Oldest to Newest",
                        "Alphabetical",
                    ].map((el, index) => {
                        const currentStylings =
                            el === activeSort ? activeStyles : inactiveStyles;

                        return (
                            <label
                                htmlFor={`sort-${index}`}
                                key={index}
                                onClick={() => setActiveSort(el as TSort)}
                                className={`${currentStylings} transition duration-100 cursor-pointer border-2 px-3 py-2 text-xs w-full flex flex-row justify-between items-center rounded`}
                            >
                                <span>{el}</span>

                                <input
                                    id={`sort-${index}`}
                                    type='radio'
                                    onChange={() => setActiveSort(el as TSort)}
                                    checked={activeSort === el}
                                    className='cursor-pointer'
                                />
                            </label>
                        );
                    })}
                </ul>

                <footer className='w-full mt-6 flex flex-row gap-3 justify-end items-center tracking-wider font-semibold text-xs'>
                    <button onClick={() => setIsActiveFilterMenu(false)}>
                        Cancel
                    </button>
                    <button
                        onClick={() => handleApplyFilters()}
                        className='py-2 px-4 rounded bg-green-500 border border-green-500 hover:bg-green-600 hover:border-green-400 hover:text-slate-200 transition duration-200 ease-in-out'
                    >
                        Apply
                    </button>
                </footer>
            </section>
        </article>
    );
}
