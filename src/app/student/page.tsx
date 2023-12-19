import SideNavigation from "../components/ui/SideNavigation";
import UpperNavigation from "../components/ui/UpperNavigation";
import Container from "../components/ui/Container";
import StudentFeedbackList from "../components/student/StudentFeedbackList";

export default function Student() {
    return (
        <Container stylings='flex flex-row'>
            <SideNavigation />

            <div className='flex-1 flex flex-col w-full'>
                <div>
                    <UpperNavigation />
                </div>

                <StudentFeedbackList />
            </div>
        </Container>
    );
}
