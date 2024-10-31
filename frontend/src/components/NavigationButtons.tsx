import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { ChevronLeftIcon } from "@heroicons/react/24/solid"
import {Box, IconButton} from "@mui/material"
import React from "react";

const NavigationButtons: React.FC<{
  onPrev: () => void
  onNext: () => void
}> = ({ onPrev, onNext }) => {

  return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
              onClick={onPrev}
              sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: "10px 0 0 10px",
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.400",
                  borderRight: "none",
                  "&:hover": {
                      bgcolor: "grey.50",
                  },
              }}
          >
              <ChevronLeftIcon className="w-4 h-4" />
          </IconButton>
          <IconButton
              onClick={onNext}
              sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: "0 10px 10px 0",
                  border: 1,
                  borderColor: "grey.400",
                  "&:hover": {
                      bgcolor: "grey.50",
                  },
              }}
          >
              <ChevronRightIcon style={{ width: "16px", height: "16px", color: "grey.500" }} />
          </IconButton>
      </Box>
  )
}

export default NavigationButtons
