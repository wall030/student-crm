import axios from 'axios'

const useDeleteStudents = () => {
  const deleteStudents = async (selectedStudents: number[]) => {
    try {
      await axios.delete(`http://localhost:8080/api/student/delete`, {
        data: selectedStudents,
      })
    } catch (error) {
      console.error('Error deleting students:', error)
      throw error
    }
  }

  return { deleteStudents }
}

export default useDeleteStudents
