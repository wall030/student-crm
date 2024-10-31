import { Student } from "../../types/Student"
import {Box, TableCell, TableRow} from "@mui/material"
import {blue} from "@mui/material/colors"

const StudentCard: React.FC<{
  student: Student
  isSelected: boolean
  onSelect: () => void
}> = ({ student, isSelected, onSelect }) => {
    return (
        <TableRow
            sx={{
                backgroundColor: isSelected ? blue[50] : "white",
                cursor: "pointer",
                borderBottom: 1,
                borderColor: "grey.300",
                "&:hover": { backgroundColor: isSelected ? blue[50] : "grey.100" },
            }}
            onClick={onSelect}
        >
            <TableCell align="left" sx={{ fontWeight: "bold", verticalAlign: "top" }}>
                {student.firstName} {student.lastName}
            </TableCell>
            <TableCell align="left" sx={{ color: "grey.800", verticalAlign: "top" }}>{student.email}</TableCell>
            <TableCell align="left" sx={{ verticalAlign: "top" }}>
                <Box component="ul">
                    {student.courses?.map((course) => (
                        <Box key={course.id} sx={{ color: "grey.800" }}>
                            {course.name}
                        </Box>
                    ))}
                </Box>
            </TableCell>
        </TableRow>
    )
}

export default StudentCard
