"use client";

import { useState } from "react";

import SideNavigation from "@/app/components/ui/SideNavigation";
import UpperNavigation from "@/app/components/ui/UpperNavigation";
import Container from "@/app/components/ui/Container";

export default function Create() {
    return (
        <Container stylings='flex flex-row'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full'>
                <div>
                    <UpperNavigation />
                </div>

                <main className='w-full h-full overflow-x-hidden overflow-y-auto flex justify-center items-center'>
                    <article className='bg-white rounded shadow p-10'>
                        <h1>does this work?!</h1>
                    </article>
                </main>
            </div>
        </Container>
    );
}
