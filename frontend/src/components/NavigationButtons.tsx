import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { ChevronLeftIcon } from "@heroicons/react/24/solid"

const NavigationButtons: React.FC<{
  onPrev: () => void
  onNext: () => void
}> = ({ onPrev, onNext }) => {

  return (
    <div>
      <button
        className="px-4 py-3 rounded-l bg-white hover:bg-slate-50 border border-gray-300 border-r-0"
        onClick={onPrev}>
        <ChevronLeftIcon className="w-3 h-3 stroke-gray-300"/>
      </button>
      <button
        className="px-4 py-3 rounded-r bg-white hover:bg-slate-50 border border-gray-300"
        onClick={onNext}>
        <ChevronRightIcon className="w-3 h-3 stroke-gray-300"/>
      </button>
    </div>
  )
}

export default NavigationButtons