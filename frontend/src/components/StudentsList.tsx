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
  const limit = 5
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Student[]>(
        `http://localhost:8080/api/student/?page=${page}&limit=${limit}&search=${searchTerm}`, 
        {
          params: {
            page,
            limit,
            search: searchTerm
          }
        }
      );
      const data = res.data

      if (data.length < limit) {
        setHasMore(false)
      }

      setStudents(prev => {
        if (page === 1) {
          return data;
        } else {
          return [...prev, ...data]
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchStudents()
  }, [page, searchTerm])

  useEffect(() => {
    setStudents([])
    setPage(1)
    setHasMore(true)
  }, [searchTerm])

  const lastStudentRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })

    if (node) observer.current.observe(node)
  }

  if (loading && students.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="space-y-4">
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
                <StudentCard student={student} />
              </div>
            ) : (
              <StudentCard key={student.id} student={student} />
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