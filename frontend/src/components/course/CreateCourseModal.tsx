import { FormattedMessage } from "react-intl"

const CreateCourseModal: React.FC<{
  newCourse: { name: string }
  setNewCourse: React.Dispatch<React.SetStateAction<{ name: string }>>
  onCreate: () => void
  onClose: () => void
}> = ({ newCourse, setNewCourse, onCreate, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">
        <FormattedMessage id="modals.course.create" defaultMessage="Create Course" />
      </h2>
      <input
        type="text"
        placeholder="Name"
        value={newCourse.name}
        onChange={(e) => setNewCourse
      ({ ...newCourse, name: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <div className="flex justify-end space-x-2 mt-4">
        <button 
          onClick={onCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
            <FormattedMessage id="buttons.create" defaultMessage="Create" />
        </button>
        <button
          onClick={onClose} 
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          <FormattedMessage id="buttons.cancel" defaultMessage="Cancel" />
        </button>
      </div>
    </div>
  </div>
)

export default CreateCourseModal