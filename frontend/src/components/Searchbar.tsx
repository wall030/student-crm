import React, {useState} from 'react'
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid'
import {Box, IconButton, InputBase} from '@mui/material'

const Searchbar: React.FC<{
    onSearch: (term: string) => void
    placeholder: string
}> = ({onSearch, placeholder}) => {
    const [term, setTerm] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(event.target.value)
    }

    const handleSubmit = () => {
        onSearch(term)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSubmit()
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                width: "100%",
                mb: 2
            }}
        >
            <InputBase
                value={term}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                fullWidth
                sx={{
                    border: 1,
                    borderColor: "grey.400",
                    borderRadius: 10,
                    pl: 2,
                    pr: 4,
                    py: 1,
                    "&:focus-within": {
                        borderColor: "primary.main"
                    },
                }}
            />
            <IconButton
                onClick={handleSubmit}
                size="medium"
                sx={{
                    position: "absolute",
                    right: 5,
                    color: "white",
                    bgcolor: "primary.main",
                    "&:hover": {
                        bgcolor: "primary.dark",
                    },
                }}
            >
                <MagnifyingGlassIcon className="w-6 h-6"/>
            </IconButton>
        </Box>
    )
}

export default Searchbar
