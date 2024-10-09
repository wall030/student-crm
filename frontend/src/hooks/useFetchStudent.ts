import { useState, useEffect } from 'react'
import axios from 'axios'
import { Student } from '../types/Student'

const useFetchStudents = (searchTerm: string, page: number) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
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

    fetchStudents()
  }, [page, searchTerm])

  return { students, loading, error, hasMore, setStudents }
}

export default useFetchStudents
