import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'
import { Student } from '../types/Student'
import CreateStudentModal from './CreateStudentModal'
import StudentActions from './StudentActions'
import EditStudentModal from './EditStudentModal'
import { StudentUpdated } from '../types/StudentUpdated'
import ManageCoursesModal from './ManageCoursesModal'
import { Course } from '../types/Course'
import NavigationButtons from './NavigationButtons'

const StudentsList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '' })
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [editableStudent, setEditableStudent] = useState<StudentUpdated>({ id: 0, firstName: '', lastName: '', email: '' })
  const [isManageCoursesModalOpen, setManageCoursesModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const limit = 10


  useEffect(() => {
    setPage(1)
    setStudents([])
    fetchStudents()
  }, [searchTerm])

  useEffect(() => {
    fetchStudents()
  }, [page])

  const fetchStudents = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get<Student[]>(`http://localhost:8080/api/student`, {
        params: {
          page,
          limit: limit,
          search: searchTerm,
        },
      })
      const data = response.data
      data.length === limit ? setHasMore(true) : setHasMore(false)
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const coursesResponse = await axios.get<Course[]>('http://localhost:8080/api/course/all')
      setCourses(coursesResponse.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((studentId) => studentId !== id) : [...prevSelected, id]
    )
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/student/delete`, { data: selectedStudents })
      setStudents((prevStudents) => prevStudents.filter((student) => !selectedStudents.includes(student.id)))
      setSelectedStudents([])
    } catch (error) {
      console.error('Error deleting students:', error)
    }
  }

  const handleCreateStudent = async () => {
    try {
      const response = await axios.post<Student>(`http://localhost:8080/api/student/create`, newStudent)
      const createdStudent = response.data
      setStudents((prevStudents) => [createdStudent, ...prevStudents])
      setCreateModalOpen(false)
      setNewStudent({ firstName: '', lastName: '', email: '' })
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const handleStudentUpdated = async (updatedStudent: StudentUpdated) => {
    try {
      await axios.put(`http://localhost:8080/api/student/update`, updatedStudent)
      setEditModalOpen(false)
      setStudents((prevStudents) =>
        prevStudents.map((student) => (student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student))
      )
      setSelectedStudents([])
    } catch (error) {
      console.error('Error updating student:', error)
    }
  }

  const handleOpenEditModal = () => {
    if (selectedStudents.length === 1) {
      const studentToEdit = students.find((student) => student.id === selectedStudents[0])
      if (studentToEdit) {
        setEditableStudent(studentToEdit)
        setEditModalOpen(true)
      }
    }
  }

  const handleManageCourses = (studentWithNewCourses: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => (student.id === studentWithNewCourses.id ? { ...student, ...studentWithNewCourses } : student))
    )
    setManageCoursesModalOpen(false)
    setSelectedStudents([])

  }

  const handleOpenManageCoursesModal = () => {
    if (selectedStudents.length === 1) {
      const student = students.find((student) => student.id === selectedStudents[0])
      if (student) {
        fetchCourses()
        setSelectedStudent(student)
        setManageCoursesModalOpen(true)
      }
    }
  }

  const isEditDisabled = selectedStudents.length !== 1

  if (loading && students.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const handlePreviousPage = () => {
    if(page != 1){
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if(hasMore){
      setPage(page + 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <NavigationButtons 
        onPrev={handlePreviousPage} 
        onNext={handleNextPage}
        />
        <StudentActions
          isEditDisabled={isEditDisabled}
          selectedStudents={selectedStudents}
          onDelete={handleDelete}
          onOpenCreateModal={() => setCreateModalOpen(true)}
          onOpenEditModal={handleOpenEditModal}
          onOpenManageCoursesModal={handleOpenManageCoursesModal}
        />
      </div>

      {isCreateModalOpen && (
        <CreateStudentModal
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          onCreate={handleCreateStudent}
          onClose={() => {
            setCreateModalOpen(false)
            setNewStudent({ firstName: '', lastName: '', email: '' })
          }}
        />
      )}

      {isEditModalOpen && (
        <EditStudentModal
          student={editableStudent}
          setStudent={setEditableStudent}
          onUpdate={() => handleStudentUpdated(editableStudent)}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isManageCoursesModalOpen && selectedStudent && (
        <ManageCoursesModal
          allCourses={courses}
          student={selectedStudent}
          onUpdate={() => handleManageCourses(selectedStudent)}
          onClose={() => {
            setManageCoursesModalOpen(false)
            setSelectedStudents([])
          }}
        />
      )}

      <div className="flex bg-gray-200 p-2 rounded-md font-bold">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Email</div>
        <div className="w-1/3">Courses</div>
      </div>

      <div>
        {students.map((student) => {
          const isSelected = selectedStudents.includes(student.id)
          return (
            <div key={student.id}>
              <StudentCard student={student} isSelected={isSelected} onSelect={() => handleSelectStudent(student.id)} />
            </div>
          )
        })}
      </div>
      {loading && <p>Loading more students...</p>}
    </div>
  )
}

export default StudentsList
