import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  const { t, i18n } = useTranslation()

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.625rem' icon='tabler:language' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          text: t('english') as string,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              saveSettings({ ...settings, direction: 'ltr', language: 'en' })
              i18n.changeLanguage('en')
              moment.locale('en')
            }
          }
        },
        {
          text: t('arabic') as string,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'ar',
            onClick: () => {
              saveSettings({ ...settings, direction: 'rtl', language: 'ar' })
              i18n.changeLanguage('ar')
              moment.locale('ar')
            }
          }
        }
      ]}
      optionOnClicks={[() => console.log('clicked1'), () => console.log('clicked2')]}
    />
  )
}

export default LanguageDropdown
