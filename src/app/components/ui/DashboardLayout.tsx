import SideNavigation from "./SideNavigation";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='w-screen h-screen flex flex-row bg-gray-200 max-md:flex-col'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full h-full overflow-x-hidden overflow-y-auto'>
                {/* <UpperNavigation /> */}

                {children}
            </div>
        </div>
    );
}
