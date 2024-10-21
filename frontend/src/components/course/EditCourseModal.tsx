import { CourseUpdated } from '../../types/CourseUpdated'

const EditCourseModal: React.FC<{
  course: CourseUpdated
  setCourse: React.Dispatch<React.SetStateAction<CourseUpdated>>
  onUpdate: () => void
  onClose: () => void
}> = ({ course, setCourse, onUpdate, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Edit Course</h2>
      <input
        type="text"
        placeholder="Name"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={onUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  </div>
)

export default EditCourseModal