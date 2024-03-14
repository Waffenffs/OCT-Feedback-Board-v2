"use client";

export default function DepartmentCard(props: TUser) {
    // Brainstorm what the design should look like!

    return (
        <article className='bg-white rounded shadow-md p-4 cursor-pointer transition hover:shadow-lg'>
            <h1 className='font-semibold text-black'>{props.account_name}</h1>
        </article>
    );
}
