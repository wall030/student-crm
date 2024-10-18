import { Course } from '../../types/Course'

const CourseCard:React.FC<{ 
    course: Course
  }> = ({ course }) => {
    return (
      <div 
        className={"flex justify-between items-center p-1 border-b border-gray-300 cursor-pointer"}

      >
        <div className="flex-1 font-bold">{course.name}</div>
        <div className="flex-1 text-gray-600">
          <ul>
            {course.students?.map((student) => (
              <li key={student.id} className="text-gray-700">
                {student.firstName} {student.lastName}
              </li>
            ))}
          </ul>
        </div>
  
        <input
          type="checkbox"
          className="ml-2"
        />
      </div>
    )
  }

export default CourseCard