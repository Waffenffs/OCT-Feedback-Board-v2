import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    const { data, error } = await supabase
        .from("accounts")
        .select("account_type")
        .eq("account_name", user?.email);

    if (error) throw error;

    const account_type: string = data[0].account_type;

    if (account_type !== "Administrator")
        return redirect(`/${account_type.toLowerCase()}`);
}
