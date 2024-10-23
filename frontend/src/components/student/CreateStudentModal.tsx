import { FormattedMessage } from "react-intl";

const CreateStudentModal: React.FC<{
  newStudent: { firstName: string; lastName: string; email: string }
  setNewStudent: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string }>>
  onCreate: () => void
  onClose: () => void
}> = ({ newStudent, setNewStudent, onCreate, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">
        <FormattedMessage id="modals.student.create" defaultMessage="Create Student" />
      </h2>
      <input
        type="text"
        placeholder="First Name"
        value={newStudent.firstName}
        onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={newStudent.lastName}
        onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={newStudent.email}
        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
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

export default CreateStudentModal