import { TrashIcon } from "@heroicons/react/24/solid"
import { PlusIcon } from "@heroicons/react/24/solid"
import { PencilSquareIcon } from "@heroicons/react/24/solid"
import { AcademicCapIcon } from "@heroicons/react/24/solid"

const StudentActions: React.FC<{
  isEditDisabled: boolean
  selectedStudents: number[]
  onDelete: () => void
  onOpenCreateModal: () => void
  onOpenEditModal: () => void
  onOpenManageCoursesModal: () => void
}> = ({ isEditDisabled, selectedStudents, onDelete, onOpenCreateModal, onOpenEditModal, onOpenManageCoursesModal }) => (
  <div className="flex justify-end space-x-4">
    <button
      className={`inline-flex items-center bg-purple-500 text-white px-4 py-2 rounded-md ${isEditDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isEditDisabled}
      onClick={onOpenManageCoursesModal}
    >
      <AcademicCapIcon className="h-5 w-5"/>
      <span className="pl-1">Manage Courses</span>
    </button>
    <button
      className={`inline-flex items-center bg-blue-500 text-white px-2 py-2 rounded-md ${isEditDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isEditDisabled}
      onClick={onOpenEditModal}
    >
      <PencilSquareIcon className="h-5 w-5" />
      <span className="pl-1">Edit</span>
    </button>
    <button
      className={`inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md ${selectedStudents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={selectedStudents.length === 0}
      onClick={onDelete}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
    <button
      className="bg-green-500 text-white px-4 py-2 rounded-md"
      onClick={onOpenCreateModal}
    >
      <PlusIcon className="h-5 w-5" />
    </button>
  </div>
)

export default StudentActions