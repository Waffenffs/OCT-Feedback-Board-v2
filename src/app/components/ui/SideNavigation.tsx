"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    IoCreateOutline,
    IoHomeOutline,
    IoLogOutOutline,
    IoSettingsOutline,
} from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";

import Link from "next/link";
import SideNavigationSkeleton from "./SideNavigationSkeleton";

import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";

export default function SideNavigation() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentPath, setCurrentPath] = useState("");
    const [sideNavHasLoaded, setSideNavHasLoaded] = useState(false);
    const [userAccountType, setUserAccountType] = useState<TAccountType | null>(
        null
    );

    const router = useRouter();
    const path = usePathname();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { user } = await getUserInfo(supabase);

                setCurrentUser(user);

                const accountInfo = await getAccountInfoWithUID(
                    supabase,
                    user?.id!
                );

                const accountType = accountInfo?.account_type;

                setUserAccountType(accountType!);
            } catch (error) {
                console.error(
                    `Error fetching user data for navigation: ${error}`
                );
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPath(path);
    }, [path]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error)
            throw `Origin app/components/ui/SideNavigation.tsx >>: ${error}`;

        router.refresh();
        router.replace("/login");
    };

    const links = {
        Student: [
            {
                href: "/student",
                label: "Home",
                icon: <IoHomeOutline />,
            },
            {
                href: "/student/settings",
                label: "Settings",
                icon: <IoSettingsOutline />,
            },
            {
                href: "/student/create",
                label: "Create",
                icon: <IoCreateOutline />,
            },
        ],
        Department: [
            {
                href: "/department",
                label: "Dashboard",
                icon: <LuLayoutDashboard />,
            },
            {
                href: "/department/settings",
                label: "Settings",
                icon: <IoSettingsOutline />,
            },
        ],
        Administrator: [
            {
                href: "/administrator",
                label: "Dashboard",
                icon: <LuLayoutDashboard />,
            },
        ],
    };

    // Is loading
    if (!currentUser && !userAccountType) return <SideNavigationSkeleton />;

    return (
        <nav className='top-0 max-md:w-screen bg-[#1c1c1c] md:h-screen tracking-wide md:flex flex-col justify-between rounded-tr-xl rounded-br-xl'>
            <div>
                <div className='w-full flex justify-center items-center py-3 px-8 border-b border-neutral-700'>
                    <img src='/oct-logo.png' alt='logo' className='w-20 h-20' />
                </div>

                <div className='hidden md:flex justify-center items-center w-full text-xs py-2 font-semibold text-green-400 border-b border-neutral-700'>
                    <div className='flex flex-row items-center gap-1 rounded py-1 px-4 bg-zinc-800'>
                        <span>OlivFeedbacks</span>
                    </div>
                </div>

                <ul className='hidden md:flex flex-col gap-4 w-full justify-center items-center py-5 text-xl font-semibold'>
                    {sideNavHasLoaded === false && (
                        <>
                            <div className='px-4 w-full'>
                                <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                            </div>
                            <div className='px-4 w-full'>
                                <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                            </div>
                            <div className='px-4 w-full'>
                                <div className='animate-pulse w-full h-9 rounded-md bg-zinc-300 dark:bg-zinc-500'></div>
                            </div>
                        </>
                    )}
                    {userAccountType &&
                        links[userAccountType].map((link, index) => {
                            if (sideNavHasLoaded == false)
                                setSideNavHasLoaded(true);

                            const isCurrentActivePath =
                                currentPath === link.href;

                            return (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`flex flex-row items-center px-3 py-2 gap-1 ${
                                        isCurrentActivePath
                                            ? "bg-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                                            : "hover:bg-zinc-700 hover:text-white"
                                    } text-neutral-500 transition duration-200 ease-in-out w-28 rounded`}
                                >
                                    <div className='flex-grow flex flex-row items-center gap-2'>
                                        {link.icon}
                                        <span className='text-xs'>
                                            {link.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                </ul>
            </div>

            <footer className='hidden md:flex flex-col gap-3 justify-center items-center py-3 border-t border-neutral-700 font-semibold text-xs text-neutral-400'>
                <button
                    onClick={() => signOut()}
                    className='flex flex-row gap-1 items-center'
                >
                    <IoLogOutOutline className='text-xl' />
                    <span>Sign out</span>
                </button>
            </footer>
        </nav>
    );
}
