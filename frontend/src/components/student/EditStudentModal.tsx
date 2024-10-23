import { FormattedMessage } from 'react-intl'
import { StudentUpdated } from '../../types/StudentUpdated'

const EditStudentModal: React.FC<{
  student: StudentUpdated
  setStudent: React.Dispatch<React.SetStateAction<StudentUpdated>>
  onUpdate: () => void
  onClose: () => void
}> = ({ student, setStudent, onUpdate, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">
        <FormattedMessage id="modals.student.edit" defaultMessage="Edit Student" />
      </h2>
      <input
        type="text"
        placeholder="First Name"
        value={student.firstName}
        onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={student.lastName}
        onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={student.email}
        onChange={(e) => setStudent({ ...student, email: e.target.value })}
        className="mb-2 border border-gray-300 rounded p-2 w-full"
      />
      <div className="flex justify-end space-x-2 mt-4">
      <button 
          onClick={onUpdate} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          <FormattedMessage id="buttons.save" defaultMessage="Save" />
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

export default EditStudentModal