import { useState } from 'react'
import axios from 'axios'
import { Student } from '../types/Student'

const useCreateStudent = () => {
  const [newStudent, setNewStudent] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: '',
    lastName: '',
    email: '',
  })

  const createStudent = async () => {
    try {
      const response = await axios.post<Student>(`http://localhost:8080/api/student/create`, newStudent)
      setNewStudent({ firstName: '', lastName: '', email: '' })
      return response.data
    } catch (error) {
      console.error('Error creating student:', error)
      throw error
    }
  }

  return { newStudent, setNewStudent, createStudent }
}

export default useCreateStudent
