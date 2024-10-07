"use client"
import React, { useEffect, useState } from 'react'
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
};


const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/student/all')
        if (!res.ok) {
          throw new Error('Failed to fetch students')
        }
        const data: Student[] = await res.json()
        setStudents(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false);
      }
    }

    fetchStudents()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students List</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  )
}

export default StudentsList