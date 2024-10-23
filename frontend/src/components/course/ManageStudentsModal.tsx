import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Course } from '../../types/Course'
import { Student } from '../../types/Student'
import { FormattedMessage } from 'react-intl'


const ManageStudentsModal: React.FC<{
  allStudents: Student[]
  course: Course
  onUpdate: (course: Course) => void
  onClose: () => void
}
> = ({ allStudents, course, onUpdate, onClose }) => {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudents(allStudents)
        
        const enrolledStudents = course.students.map(student => student.id)
        setSelectedStudents(enrolledStudents)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    fetchStudents()
  }, [allStudents])

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents((prevSelectedStudents) => {
      if (prevSelectedStudents.includes(studentId)) {
        return prevSelectedStudents.filter(id => id !== studentId)
      } else {
        return [...prevSelectedStudents, studentId]
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/course/${course.id}/assignStudents`, 
        selectedStudents
      )
      course.students = response.data
      onClose()
      onUpdate(course)
    } catch (error) {
      console.error('Error updating courses:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-bold mb-4">
          <FormattedMessage id="actions.manage.students.title" defaultMessage="Manage Students for " />
          {course.name}
        </h2>
        
        <div className="max-h-60 overflow-auto ">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-normal mb-2 border-b border-gray-300">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudentToggle(student.id)}
              />
              <span className="px-2">
                {student.firstName} {student.lastName}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end space-x-4">
        <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            <FormattedMessage id="buttons.save" defaultMessage="Save" />
          </button>
          <button 
            className="bg-gray-300 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            <FormattedMessage id="buttons.cancel" defaultMessage="Cancel" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageStudentsModal