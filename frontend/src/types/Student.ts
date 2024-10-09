import { Course } from "./Course"

export type Student = {
    id: number
    firstName: string
    lastName: string
    email: string
    courses: Course[]
  }
  