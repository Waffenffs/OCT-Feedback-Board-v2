import DepartmentsList from "@/app/components/administrator/DepartmentsList";

export default function Administrator() {
    return (
        <div className='w-full h-full p-10'>
            <h1 className='text-3xl font-bold text-slate-900'>Departments</h1>
            <DepartmentsList />
        </div>
    );
}
