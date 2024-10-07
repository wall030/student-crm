type Student = {
  id: number
  firstName: string
  lastName: string
  email: string
  courses: Course[]
}

type Course = {
  id: number
  name: string
}

type StudentCardProps = {
  student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-300">
      <div className="flex-1 font-bold">{student.firstName} {student.lastName}</div>
      <div className="flex-1 text-gray-600">{student.email}</div>
      <div className="flex-1 text-gray-600">
        {student.courses.map(course => (
            <li key={course.id} className="text-gray-700">{course.name}</li>
          ))}
      </div>
    </div>
  )
}

export default StudentCard