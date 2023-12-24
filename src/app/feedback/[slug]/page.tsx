import SideNavigation from "@/app/components/ui/SideNavigation";
import UpperNavigation from "@/app/components/ui/UpperNavigation";
import Container from "@/app/components/ui/Container";

export default function Feedback() {
    return (
        <Container stylings='flex flex-row'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full'>
                <UpperNavigation />

                <div className='w-full h-full p-10'>
                    <h1>my feedback page</h1>
                </div>
            </div>
        </Container>
    );
}
