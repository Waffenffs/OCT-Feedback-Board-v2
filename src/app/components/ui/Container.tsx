type TContainerProps = {
    children: React.ReactNode;
    stylings?: string;
};

export default function Container({ children, stylings }: TContainerProps) {
    return (
        <main className={`w-screen h-screen bg-slate-200 ${stylings}`}>
            {children}
        </main>
    );
}
