import { Student } from "../../types/Student"

const StudentCard: React.FC<{
  student: Student
  isSelected: boolean
  onSelect: () => void
}> = ({ student, isSelected, onSelect }) => {
  return (
    <tr
      className={`border-b border-gray-300 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
      onClick={onSelect}
    >
      <td className="px-4 py-2 font-bold">
        {student.firstName} {student.lastName}
      </td>
      <td className="px-4 py-2 text-gray-600">{student.email}</td>
      <td className="px-4 py-2 text-gray-600">
        <ul>
          {student.courses?.map((course) => (
            <li key={course.id} className="text-gray-700">
              {course.name}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  )
}

export default StudentCard