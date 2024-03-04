"use client";

import { useEffect, useState } from "react";

export default function DepartmentList({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(false);
        };

        fetchDepartments();
    }, []);

    return (
        <section className='flex flex-row flex-wrap w-full'>{children}</section>
    );
}
