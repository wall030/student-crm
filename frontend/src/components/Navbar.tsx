import {Link as RouterLink, useLocation} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'
import {GlobeAltIcon} from '@heroicons/react/24/outline'
import React, {useState} from 'react'
import {Link, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box} from '@mui/material'

const Navbar: React.FC<{
    setLocale: (locale: string) => void
}> = ({setLocale}) => {
    const location = useLocation()
    const isStudentsPage = location.pathname === '/students'
    const isCoursesPage = location.pathname === '/courses'
    const buttonVariantCourses: "text" | "outlined" | "contained" = isCoursesPage ? "contained" : "outlined"
    const buttonVariantStudents: "text" | "outlined" | "contained" = isStudentsPage ? "contained" : "outlined"

    const [anchorEl, setAnchorEl] = useState<HTMLElement>()

    const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(undefined)
    }

    const handleChangeLanguage = (locale: string) => {
        setLocale(locale)
        handleClose()
    }

    return (
        <AppBar position="static" color="default" elevation={4} role="main-nav">
            <Toolbar>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <Link component={RouterLink} to="/" sx={{textDecoration: "none", color: "inherit"}}>
                        <Box component="span" sx={{typography: "h6"}} role="nav-home">
                            <Box component="span" sx={{fontWeight: "bold"}}>
                                Student
                            </Box>
                            <Box component="span" sx={{ color: "primary.main", fontWeight: "bold" }}>
                                CRM
                            </Box>
                        </Box>
                    </Link>

                    <Box display="flex" alignItems="center">
                        <Link component={RouterLink} to="/students" sx={{textDecoration: "none"}}>
                            <Button
                                role="nav-students"
                                variant={buttonVariantStudents}
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                <FormattedMessage id="navbar.students" defaultMessage="Students"/>
                            </Button>
                        </Link>

                        <Link component={RouterLink} to="/courses" sx={{textDecoration: "none"}}>
                            <Button
                                role="nav-courses"
                                variant={buttonVariantCourses}
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                <FormattedMessage id="navbar.courses" defaultMessage="Courses"/>
                            </Button>
                        </Link>

                        <IconButton color="primary" onClick={handleLanguageClick}>
                            <GlobeAltIcon className="w-6 h-6"/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            transformOrigin={{vertical: "top", horizontal: "right"}}
                            sx={{ mt: 2 }}
                        >
                            <MenuItem onClick={() => handleChangeLanguage("en")}>
                                <FormattedMessage id="language.en" defaultMessage="English"/>
                            </MenuItem>
                            <MenuItem onClick={() => handleChangeLanguage("de")}>
                                <FormattedMessage id="language.de" defaultMessage="German"/>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
