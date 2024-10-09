import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'
import { Student } from '../types/Student'
import CreateStudentModal from './CreateStudentModal'
import StudentActions from './StudentActions'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

const StudentsList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

  const [newStudent, setNewStudent] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)

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
    setStudents([])
    setPage(1)
    setHasMore(true)
  }, [searchTerm])

  const handleSelectStudent = (id: number) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((studentId) => studentId !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/student/delete`, {
        data: selectedStudents
      })
      setStudents((prev) => prev.filter((student) => !selectedStudents.includes(student.id)))
      setSelectedStudents([])
    } catch (error) {
      console.error('Error deleting students:', error)
    }
  }

  const handleCreateStudent = async () => {
    try {
      const response = await axios.post<Student>(`http://localhost:8080/api/student/create`, newStudent)
      setStudents((prev) => [...prev, response.data])
      setCreateModalOpen(false)
      setNewStudent({ firstName: '', lastName: '', email: '' })
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const isEditDisabled = selectedStudents.length !== 1

  const lastStudentRef = useInfiniteScroll(loading, hasMore, setPage)

  if (loading && students.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="space-y-4">
      <StudentActions 
        isEditDisabled={isEditDisabled} 
        selectedStudents={selectedStudents} 
        onDelete={handleDelete} 
        onOpenCreateModal={() => setCreateModalOpen(true)} 
      />

      {isCreateModalOpen && (
        <CreateStudentModal
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          onCreate={handleCreateStudent}
          onClose={() => setCreateModalOpen(false)}
        />
      )}

      <div className="flex bg-gray-200 p-2 rounded-md font-bold">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Email</div>
        <div className="w-1/3">Courses</div>
      </div>

      <div className="space-y-4">
        {students.map((student, index) => {
          const isSelected = selectedStudents.includes(student.id)
          const cardProps = {
            student,
            isSelected,
            onSelect: () => handleSelectStudent(student.id),
          }
          
          const ref = index === students.length - 1 ? lastStudentRef : null

          return (
            <div key={student.id} ref={ref}>
              <StudentCard {...cardProps} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentsList
