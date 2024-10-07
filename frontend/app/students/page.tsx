import StudentsList from '@/components/StudentsList'

const StudentsView = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4" />
        <div className="w-full px-4">
          <StudentsList />
        </div>
      </div>
    )
  }
  
  export default StudentsView
  