import {FormattedMessage} from "react-intl"
import {Box, Typography} from "@mui/material"

const Home = () => {
    return (
        <Box textAlign="center" sx={{mt: 10}} role="home-page">
            <Typography
                variant="h3"
                component="h1"
                sx={{fontWeight: 'bold', marginBottom: 4}}
            >
                <FormattedMessage id="page.home.welcome" defaultMessage="Welcome to Student CRM"/>
            </Typography>
            <Typography
                variant="h6"
                sx={{color: 'text.secondary'}}
            >
                <FormattedMessage id="page.home.description"
                                  defaultMessage="Manage your students and courses easily. Use the navigation to get started."/>
            </Typography>
        </Box>
    )
}

export default Home
