import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Course } from '../types/Course'
import { Student } from '../types/Student'

interface ManageCoursesModalProps {
  allCourses: Course[]
  student: Student
  onUpdate: (student: Student) => void
  onClose: () => void
}

const ManageCoursesModal: React.FC<ManageCoursesModalProps> = ({ allCourses, student, onUpdate, onClose }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourses(allCourses)
        
        const enrolledCourses = student.courses.map(course => course.id)
        setSelectedCourses(enrolledCourses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [allCourses])

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter(id => id !== courseId)
      } else {
        return [...prevSelectedCourses, courseId]
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/student/${student.id}/assignCourses`, 
        selectedCourses
      )
      student.courses = response.data
      onClose()
      onUpdate(student)
    } catch (error) {
      console.error('Error updating courses:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-bold mb-4">Manage Courses for {student.firstName} {student.lastName}</h2>
        
        <div className="max-h-60 overflow-auto ">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-normal mb-2 border-b border-gray-300">
              <input
                type="checkbox"
                checked={selectedCourses.includes(course.id)}
                onChange={() => handleCourseToggle(course.id)}
              />
              <span className="px-2">
                {course.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end space-x-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default ManageCoursesModal