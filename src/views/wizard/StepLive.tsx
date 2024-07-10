import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { t } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import FireworksContainer from 'src/@core/components/fireworks-container'
import Icon from 'src/@core/components/icon'
import WebsitePreviewCard from 'src/@core/components/website-preview-card'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'
import GeneratingWebsiteCard from 'src/views/wizard/GeneratingWebsiteCard'
import PromptSummary from 'src/views/wizard/PromptSummary'

const StepLive = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)

  const stopFireworks = () => dispatch(setWizardState({ ...wizard, playFireworks: false }))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <img width={200} height={200} src='/excited.png' />
          </Box>
          <Typography variant='h4' sx={{ mb: 4 }}>
            {t('thank_you')}
          </Typography>
          {wizard.generated ? (
            <Box sx={{ mb: 4, color: 'text.secondary' }}>{t('your_website_is_live')}</Box>
          ) : (
            <Box sx={{ mb: 4, color: 'text.secondary' }}>{t('your_website_is_ready_to_be_generated')}</Box>
          )}
          {wizard.generated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'text.secondary' } }}>
              <Icon icon='carbon:gui-management' fontSize={20} />
              <Box sx={{ ml: 1.5, color: 'text.secondary' }}>
                <Typography component='span' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {t('create_an_account_to_manage_your_website')}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'text.secondary' } }}>
              <Icon icon='tabler:clock' fontSize={20} />
              <Box sx={{ ml: 1.5, color: 'text.secondary' }}>
                <Typography component='span' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {t('it_will_not_take_more_than_3_minutes')}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
      <PromptSummary />
      <Grid item xs={12}>
        <Divider sx={{ m: '0 !important' }} />
      </Grid>
      <Grid item xs={12} md={8} lg={4} xl={4}>
        {wizard.generating ? (
          <GeneratingWebsiteCard title={t('your_website_is_being_generated')} />
        ) : wizard.generated ? (
          <WebsitePreviewCard
            url='https://safha-website.vercel.app'
            code='https://github.com/younes-alturkey/safha-website'
            title={`${wizard.details.about.name}` || t('your_website')}
            preview={wizard.preview}
          />
        ) : null}
      </Grid>

      <FireworksContainer play={wizard.playFireworks} dur={7000} onDone={stopFireworks} />
    </Grid>
  )
}

export default StepLive
