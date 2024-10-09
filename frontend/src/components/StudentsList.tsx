import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'

type Course = {
  id: number
  name: string
}

type Student = {
  id: number
  firstName: string
  lastName: string
  email: string
  courses: Course[]
}

const StudentsList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const limit = 5
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<Student[]>(
        `http://localhost:8080/api/student`,
        {
          params: {
            page,
            limit,
            search: searchTerm,
          },
        }
      )
      const data = response.data;

      if (data.length < limit) {
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
      console.log('Deleting the following students:', selectedStudents)
      const response = await axios.delete('http://localhost:8080/api/student/delete', {
        data: selectedStudents
      })
      console.log('Delete response:', response)
  
      setStudents((prev) => prev.filter((student) => !selectedStudents.includes(student.id)))
      setSelectedStudents([])
    } catch (error) {
      console.error('Error deleting students:', error)
    }
  }
  

  const isEditDisabled = selectedStudents.length !== 1

  const lastStudentRef = (node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1)
      }
    })

    if (node) observer.current.observe(node)
  }

  if (loading && students.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isEditDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isEditDisabled}
        >
          Edit
        </button>
        <button
          className={`bg-red-500 text-white px-4 py-2 rounded-md ${selectedStudents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedStudents.length === 0}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      <div className="flex bg-gray-200 p-2 rounded-md font-bold">
        <div className="w-1/3">Name</div>
        <div className="w-1/3">Email</div>
        <div className="w-1/3">Courses</div>
      </div>

      <div className="space-y-4">
        {students.length > 0 ? (
          students.map((student, index) =>
            index === students.length - 1 ? (
              <div ref={lastStudentRef} key={student.id}>
                <StudentCard
                  student={student}
                  isSelected={selectedStudents.includes(student.id)}
                  onSelect={() => handleSelectStudent(student.id)}
                />
              </div>
            ) : (
              <StudentCard
                key={student.id}
                student={student}
                isSelected={selectedStudents.includes(student.id)}
                onSelect={() => handleSelectStudent(student.id)}
              />
            )
          )
        ) : (
          !loading && <p>No students found.</p>
        )}
      </div>

      {loading && students.length > 0 && <p>Loading more...</p>}
    </div>
  )
}

export default StudentsList
