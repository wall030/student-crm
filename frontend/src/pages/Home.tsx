import { FormattedMessage } from "react-intl"

const Home = () => {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
        <FormattedMessage id="page.home.welcome" defaultMessage="Welcome to Student CRM" />
        </h1>
        <p className="text-lg text-gray-600">
        <FormattedMessage id="page.home.description" defaultMessage="Manage your students and courses easily. Use the navigation to get started." />
        </p>
      </div>
    )
  }
  
  export default Home
  