// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

interface GeneratingWebsiteCardProps {
  title: string
}

const GeneratingWebsiteCard = (props: GeneratingWebsiteCardProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Card sx={{ backgroundColor: theme.palette.customColors.trackBg }}>
      <CardMedia
        className='animate-pulse'
        component='div'
        sx={{
          height: '18rem',
          backgroundColor: theme.palette.customColors.avatarBg,
          borderBottom: 'solid',
          borderBottomColor: theme.palette.grey[400]
        }}
      />
      <CardContent>
        <Typography variant='h5' sx={{ mb: 4 }} className='animate-pulse'>
          {props.title}
        </Typography>
        <Box display='flex' gap={4}>
          <Button variant='contained' disabled={true}>
            {t('view_website')}
          </Button>
          <Button variant='tonal' disabled={true}>
            {t('download_code')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default GeneratingWebsiteCard
