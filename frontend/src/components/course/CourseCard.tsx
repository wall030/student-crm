import { Course } from '../../types/Course'

const CourseCard: React.FC<{
  course: Course
  isSelected: boolean
  onSelect: () => void
}> = ({ course, isSelected, onSelect }) => {
  return (
    <tr
      className={`border-b border-gray-300 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
      onClick={onSelect}
    >
      <td className="px-4 py-2 font-bold">{course.name}</td>
      <td className="px-4 py-2 text-gray-600">
        <ul>
          {course.students?.map((student) => (
            <li key={student.id} className="text-gray-700">
              {student.firstName} {student.lastName}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  )
}

export default CourseCard