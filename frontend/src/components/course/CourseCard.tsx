import { Course } from '../../types/Course'
import {Box, TableCell, TableRow} from "@mui/material"
import {blue} from "@mui/material/colors"
import React from "react";

const CourseCard: React.FC<{
  course: Course
  isSelected: boolean
  onSelect: () => void
}> = ({ course, isSelected, onSelect }) => {
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
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
                {course.name}
            </TableCell>
            <TableCell align="left" sx={{ color: "grey.800" }}>
                <Box component="ul" sx={{ padding: 0, margin: 0 }}>
                    {course.students?.map((student) => (
                        <Box component="li" key={student.id} sx={{ color: "grey.700" }}>
                            {student.firstName} {student.lastName}
                        </Box>
                    ))}
                </Box>
            </TableCell>
        </TableRow>
    )
}

export default CourseCard
