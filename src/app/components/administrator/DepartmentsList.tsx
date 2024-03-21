import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import DepartmentCard from "@/app/components/administrator/DepartmentCard";

export default async function DepartmentsList() {
    const supabase = createServerComponentClient({ cookies });

    const { data: departments, error: err } = await supabase
        .from("accounts")
        .select("*")
        .eq("account_type", "Department");

    if (err) {
        console.error("Error fetching departments!");
    }

    return (
        <section className='w-full flex flex-col gap-2 mt-5'>
            {departments?.map((department: TUser, index) => {
                return <DepartmentCard key={index} {...department} />;
            })}
        </section>
    );
}
