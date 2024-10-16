import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'
import { Student } from '../types/Student'
import CreateStudentModal from './CreateStudentModal'
import StudentActions from './StudentActions'
import EditStudentModal from './EditStudentModal'
import { StudentUpdated } from '../types/StudentUpdated'
import ManageCoursesModal from './ManageCoursesModal'

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

  const observer = useRef<IntersectionObserver | null>(null)

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<Student[]>(`http://localhost:8080/api/student`, {
        params: {
          page,
          limit: 5,
          search: searchTerm,
        },
      })
      const data = response.data

      if (data.length < 5) {
        setHasMore(false)
      }

      setStudents((prev) => (page === 1 ? data : [...prev, ...data]))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [page, searchTerm])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchStudents()
  }, [searchTerm])

  const lastStudentRef = (node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1)
      }
    })

    if (node) observer.current.observe(node)
  }

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((studentId) => studentId !== id) : [...prevSelected, id]
    )
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/student/delete`, { data: selectedStudents })
      setSelectedStudents([])
      fetchStudents()
    } catch (error) {
      console.error('Error deleting students:', error)
    }
  }

  const handleCreateStudent = async () => {
    try {
      await axios.post<Student>(`http://localhost:8080/api/student/create`, newStudent)
      setCreateModalOpen(false)
      fetchStudents()
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const handleStudentUpdated = async (updatedStudent: StudentUpdated) => {
    try {
      await axios.put(`http://localhost:8080/api/student/update`, updatedStudent)
      setEditModalOpen(false)
      fetchStudents()
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

  const handleOpenManageCoursesModal = () => {
    if (selectedStudents.length === 1) {
      const student = students.find((student) => student.id === selectedStudents[0])
      if (student) {
        setSelectedStudent(student)
        setManageCoursesModalOpen(true)
      }
    }
  }

  const isEditDisabled = selectedStudents.length !== 1

  if (loading && students.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="space-y-4">
      <StudentActions
        isEditDisabled={isEditDisabled}
        selectedStudents={selectedStudents}
        onDelete={handleDelete}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onOpenEditModal={handleOpenEditModal}
        onOpenManageCoursesModal={handleOpenManageCoursesModal}
      />

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
          onUpdate={() => handleStudentUpdated}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isManageCoursesModalOpen && selectedStudent && (
        <ManageCoursesModal
          student={selectedStudent}
          onUpdate={fetchStudents}
          onClose={() => setManageCoursesModalOpen(false)}
        />
      )}

      <div className="flex bg-gray-200 p-2 rounded-md font-bold">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Email</div>
        <div className="w-1/3">Courses</div>
      </div>

      <div>
        {students.map((student, index) => {
          const isSelected = selectedStudents.includes(student.id)
          const ref = index === students.length - 1 ? lastStudentRef : null
          return (
            <div key={student.id} ref={ref}>
              <StudentCard student={student} isSelected={isSelected} onSelect={() => handleSelectStudent(student.id)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentsList