import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomAvatar from 'src/@core/components/mui/avatar'
import WebsitePreviewCard from 'src/@core/components/website-preview-card'
import { AppDispatch } from 'src/store'
import { deleteWebsite } from 'src/store/apps/chat'

type WebsiteLiveMessageProps = {
  title: string
  url: string
  code: string
}

const WebsiteLiveMessage = (props: WebsiteLiveMessageProps) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { deleting } = useSelector((state: any) => state.chat)
  const { t } = useTranslation()
  const logo = '/logo.png'
  const breakpointMD = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'lg'))
  const [preview, setPreview] = useState<any>(null)

  const handleManageWebsite = () => {
    router.push({ pathname: '/signup', query: { websiteId: '#1536548131' } })
  }

  const handleDeleteWebsite = async () => {
    await dispatch(deleteWebsite())
    await router.push('/')
    toast(t('website_deleted_successfully'))
  }

  const updateSiteShot = async () => {
    const siteShot = '/siteshot.png'
    setPreview(siteShot)
  }

  useEffect(() => {
    updateSiteShot()
  })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mb: 4
      }}
    >
      <CustomAvatar
        src={logo}
        alt={'Safha logo'}
        skin='light'
        color='primary'
        sx={{
          width: 32,
          height: 32,
          ml: undefined,
          mr: 3,
          fontSize: theme => theme.typography.body1.fontSize
        }}
      />

      <Box className='chat-body' sx={{ width: '100%' }}>
        <Box sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <WebsitePreviewCard title={props.title} url={props.url} preview={preview} code={props.code} />
            </Grid>
          </Grid>
          <Grid container spacing={6} mt={1}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 4, ...(breakpointMD ? { justifyContent: 'flex-end' } : {}) }}>
                <Button fullWidth={!breakpointMD} variant='contained' onClick={handleManageWebsite} disabled={deleting}>
                  {t('manage_your_website')}
                </Button>
                <LoadingButton
                  fullWidth={!breakpointMD}
                  variant='contained'
                  color='error'
                  onClick={handleDeleteWebsite}
                  loading={deleting}
                >
                  {t('delete')}
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {moment.unix(Math.floor(Date.now() / 1000)).fromNow()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default WebsiteLiveMessage
