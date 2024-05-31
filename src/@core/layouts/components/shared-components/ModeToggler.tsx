import IconButton from '@mui/material/IconButton'
import { useSession } from 'next-auth/react'
import Icon from 'src/@core/components/icon'
import { Settings } from 'src/@core/context/settingsContext'
import { getUniqueId, handleCreateEvent, modeToggle } from 'src/@core/utils'
import { Events } from 'src/types/enums'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const ModeToggler = (props: Props) => {
  const { data: session } = useSession()
  const { settings, saveSettings } = props

  const handleModeToggle = async () => {
    const mode = settings.mode
    modeToggle(settings, saveSettings)
    let email = getUniqueId()
    const user = session?.user
    if (user && user.email) email = user.email
    await handleCreateEvent(Events.SWITCHED_MODE, email, [`user_email: ${email}`, `current_mode: ${mode}`])
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      <Icon fontSize='1.625rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
    </IconButton>
  )
}

export default ModeToggler
