import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

const Searchbar: React.FC<{
    onSearch: (term: string) => void
}> = ({ onSearch }) => {

    const [term, setTerm] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value)
  }

  const handleSubmit = () => {
    onSearch(term)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  };

  return (
    <div className="relative flex items-center">
    <input
      type="text"
      value={term}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      placeholder="Search by name or email..."
      className="border border-gray-300 rounded-full p-2 pl-4 pr-10 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    />
    <button
      onClick={handleSubmit}
      className="absolute right-1 bg-blue-500 text-white p-2 mb-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2"
    >
      <MagnifyingGlassIcon className="h-5 w-5" />
    </button>
  </div>
  )
}


export default Searchbar