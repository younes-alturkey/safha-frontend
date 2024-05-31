import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'

export default function AboutTab() {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  return (
    <TabPanel value='about' sx={{ p: 0 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label={wizard.type === 'business' ? t('what_is_your_business_name?') : t('what_is_your_name?')}
            placeholder={
              (wizard.type === 'business'
                ? t('what_is_your_business_name_placeholder')
                : t('younes_alturkey')) as string
            }
            value={wizard.details.about.name}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, name: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label={wizard.type === 'business' ? t('where_is_it_located?') : t('where_are_you_located?')}
            placeholder={
              (wizard.type === 'business'
                ? t('where_is_it_located_placeholder')
                : t('where_are_you_located_placeholder')) as string
            }
            value={wizard.details.about.location}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, location: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label={wizard.type === 'business' ? t('what_is_your_business_email?') : t('what_is_your_email?')}
            placeholder={
              (wizard.type === 'business'
                ? t('what_is_your_business_email_placeholder')
                : t('what_is_your_email_placeholder')) as string
            }
            value={wizard.details.about.email}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, email: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label={
              wizard.type === 'business' ? t('what_is_your_business_phone_number?') : t('what_is_your_phone_number?')
            }
            placeholder={t('phone_number_placeholder') as string}
            value={wizard.details.about.phoneNumber}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, phoneNumber: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            multiline
            minRows={4}
            label={t('what_do_you_do?')}
            placeholder={
              (wizard.type === 'business'
                ? t('what_do_you_do?_placeholder_business')
                : t('what_do_you_do?_placeholder')) as string
            }
            value={wizard.details.about.whatDoYouDo}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, whatDoYouDo: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            multiline
            label={t('what_are_your_socials?')}
            placeholder={t('what_are_your_socials?_placeholder') as string}
            value={wizard.details.about.socials}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    about: { ...wizard.details.about, socials: e.target.value }
                  }
                })
              )
            }
          />
        </Grid>
      </Grid>
    </TabPanel>
  )
}
