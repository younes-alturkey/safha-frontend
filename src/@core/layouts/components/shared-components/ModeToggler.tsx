import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { Settings } from 'src/@core/context/settingsContext'
import { modeToggle } from 'src/@core/utils'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const ModeToggler = (props: Props) => {
  const { settings, saveSettings } = props

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      <Icon fontSize='1.625rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
    </IconButton>
  )
}

export default ModeToggler
