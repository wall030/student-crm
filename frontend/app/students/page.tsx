"use client"
import React, { useState } from 'react'
import StudentsList from '@/components/StudentsList'

const StudentsView = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students List</h1>
      <input
        type="text"
        placeholder="Search by name or email..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <StudentsList searchTerm={searchTerm} />
    </div>
  )
}

export default StudentsView
