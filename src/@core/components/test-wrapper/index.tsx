import { ThemeProvider, createTheme } from '@mui/material/styles'
import { I18nextProvider } from 'react-i18next'
import { SettingsProvider, initialSettings as settings } from 'src/@core/context/settingsContext'
import themeOptions from 'src/@core/theme/ThemeOptions'
import i18n from 'src/configs/i18n' // Import your i18n configuration

type Props = {
  mode: 'light' | 'dark'
  children: React.ReactNode
}

export default function TestWrapper(props: Props) {
  const theme = createTheme(themeOptions(settings, props.mode))

  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </SettingsProvider>
    </I18nextProvider>
  )
}
