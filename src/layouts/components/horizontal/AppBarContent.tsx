import Box from '@mui/material/Box'
import { Settings } from 'src/@core/context/settingsContext'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
  user: any
}

const AppBarContent = (props: Props) => {
  const { settings, saveSettings, user } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <UserDropdown settings={settings} user={user} />
    </Box>
  )
}

export default AppBarContent
