const StudentActions: React.FC<{
  isEditDisabled: boolean
  selectedStudents: number[]
  onDelete: () => void
  onOpenCreateModal: () => void
}> = ({ isEditDisabled, selectedStudents, onDelete, onOpenCreateModal }) => (
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
      onClick={onDelete}
    >
      Delete
    </button>
    <button
      className="bg-green-500 text-white px-4 py-2 rounded-md"
      onClick={onOpenCreateModal}
    >
      +
    </button>
  </div>
)

export default StudentActions