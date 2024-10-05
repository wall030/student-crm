import CoursesList from "@/components/CoursesList"

const CoursesView = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Courses View</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CoursesList>

          </CoursesList>
        </div>
      </div>
    )
  }
  
  export default CoursesView;
  