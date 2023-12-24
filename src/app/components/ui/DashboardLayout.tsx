import SideNavigation from "./SideNavigation";
import UpperNavigation from "./UpperNavigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='w-screen h-screen flex flex-row bg-gray-200'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full'>
                <UpperNavigation />

                {children}
            </div>
        </div>
    );
}
