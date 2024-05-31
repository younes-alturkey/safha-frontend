import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import SingleUploadMediaUploader from 'src/@core/components/media-uploader/single-upload'
import { isUrl } from 'src/@core/utils'

export interface FileProp {
  name: string
  type: string
  size: number
}

interface GalleryImageWidgetProps {
  title: string
  image: any
  uploading: boolean
  onChange: (gallery: any) => Promise<void>
  onImageChange: (image: any) => void
  onUpload: () => Promise<void>
  onOpenImagesLibrary: () => void
}

const GalleryImageWidget = (props: GalleryImageWidgetProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: 256,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1
      }}
    >
      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{props.title}</Typography>
      </Box>

      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4 }}>
        <SingleUploadMediaUploader
          file={props.image}
          isUploaded={isUrl(props.image)}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
          }}
          uploading={props.uploading}
          disabled={false}
          onFileChange={(file: any) => props.onImageChange(file)}
          onUpload={props.onUpload}
          onClear={() => props.onImageChange(null)}
        />

        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant='caption'>{t('or')}</Typography>
        </Box>

        <Box
          onClick={props.onOpenImagesLibrary}
          sx={{
            width: 256,
            height: 256,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`,
            cursor: 'pointer'
          }}
        >
          <Icon icon='bxs:image-add' fontSize='3rem' style={{ color: theme.palette.grey[300] }} />
          <Typography textAlign='center' sx={{ opacity: 0.5, fontSize: '0.6rem' }}>
            {t('select_from_library')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default GalleryImageWidget
