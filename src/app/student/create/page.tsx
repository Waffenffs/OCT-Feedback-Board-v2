import SideNavigation from "@/app/components/ui/SideNavigation";
import UpperNavigation from "@/app/components/ui/UpperNavigation";
import Container from "@/app/components/ui/Container";

export default function Create() {
    return (
        <Container stylings='flex flex-row'>
            <SideNavigation />
            <div className='flex-1'>
                <UpperNavigation />
            </div>
        </Container>
    );
}
