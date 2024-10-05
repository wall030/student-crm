import StudentsList from '@/components/StudentsList';

const StudentsView = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Students View</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StudentsList>

          </StudentsList>
        </div>
      </div>
    )
  }
  
  export default StudentsView;
  