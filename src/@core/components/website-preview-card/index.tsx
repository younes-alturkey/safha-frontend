import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

interface WebsitePreviewCardProps {
  title: string
  url: string
  preview: any
  code: string
}

const WebsitePreviewCard = (props: WebsitePreviewCardProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Card
      sx={{
        backgroundColor: isDark ? theme.palette.customColors.trackBg : theme.palette.customColors.lightPaperBg
      }}
    >
      <CardMedia
        sx={{
          height: '18rem',
          backgroundPosition: props.preview && props.preview.includes('placeholder') ? 'center' : 'top',
          borderBottom: 'solid',
          borderBottomColor: theme.palette.primary.main
        }}
        {...(props.preview ? { image: props.preview } : { component: 'div' })}
        className={props.preview ? '' : 'animate-pulse grayscale'}
      />
      <CardContent>
        <Typography variant='h5' sx={{ mb: 4 }}>
          {props.title}
        </Typography>
        <Box display='flex' gap={4}>
          <a href={props.url} target='_blank' rel='noopener noreferrer'>
            <Button variant='contained'>{t('view_website')}</Button>
          </a>
          <a href={props.code} target='_blank' rel='noopener noreferrer'>
            <Button variant='tonal'>{t('download_code')}</Button>
          </a>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WebsitePreviewCard
