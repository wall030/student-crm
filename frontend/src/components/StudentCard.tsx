import { Student } from "../types/Student"

const StudentCard: React.FC<{ 
  student: Student
  isSelected: boolean
  onSelect: () => void
}> = ({ student, isSelected, onSelect }) => {
  return (
    <div 
      className={`flex justify-between items-center p-1 border-b border-gray-300 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
      onClick={onSelect}
    >
      <div className="flex-1 font-bold">{student.firstName} {student.lastName}</div>
      <div className="flex-1 text-gray-600">{student.email}</div>
      <div className="flex-1 text-gray-600">
        <ul>
          {student.courses?.map((course) => (
            <li key={course.id} className="text-gray-700">
              {course.name}
            </li>
          ))}
        </ul>
      </div>

      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className="ml-2"
      />
    </div>
  )
}

export default StudentCard
