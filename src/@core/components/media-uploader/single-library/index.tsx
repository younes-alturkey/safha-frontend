import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Accept } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { createObjectURL, isUrl } from 'src/@core/utils'

interface MediaUploaderProps {
  index: number
  title?: string
  file: any
  accept: Accept
  uploading: boolean
  deleting: boolean
  disabled: boolean
  onOpenImagesLibrary: (index: number) => void
  onUpload: () => Promise<void>
  onDelete: () => Promise<void>
  onClear: () => void
}

export default function SingleLibraryMediaUploader(props: MediaUploaderProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [isContain, setIsContain] = useState(false)

  function toggleContain() {
    setIsContain(!isContain)
  }

  function handleOpenImagesLibrary() {
    props.onOpenImagesLibrary(props.index)
  }

  return (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='flex-start'
      gap={1}
    >
      {props.title && (
        <Box sx={{ width: '100%' }} display='flex' justifyContent='flex-start' alignItems='flex-start' gap={1} mb={1}>
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{props.title}</Typography>
        </Box>
      )}

      <Box
        onClick={handleOpenImagesLibrary}
        sx={{
          width: 256,
          height: 256,
          overflow: 'hidden',
          border: 'dotted',
          borderWidth: 2,
          p: 1,
          borderRadius: 1,
          marginTop: -1,
          borderColor: isDark ? theme.palette.grey[700] : theme.palette.grey[300]
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          {props.file ? (
            <img
              alt={props.file.name}
              style={{
                objectFit: isContain ? 'contain' : 'cover',
                objectPosition: isContain ? 'center' : 'top',
                width: '100%',
                height: '100%'
              }}
              src={isUrl(props.file) ? (props.file as any) : createObjectURL(props.file as any)}
            />
          ) : (
            <Box
              sx={{
                mb: 8.75,
                width: '100%',
                height: '100%',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
              }}
            >
              <Icon icon='bxs:image-add' fontSize='3rem' style={{ color: theme.palette.grey[300] }} />
              <Typography textAlign='center' sx={{ opacity: 0.5, fontSize: '0.6rem' }}>
                {t('select_from_library')}
              </Typography>
            </Box>
          )}

          {isUrl(props.file) && (
            <Icon
              style={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: 4,
                ...(isAr ? { left: 4 } : { right: 4 })
              }}
              fontSize='1.3rem'
              icon='ph:seal-check-fill'
            />
          )}
        </Box>
      </Box>

      {props.file && (
        <LoadingButton
          onClick={toggleContain}
          style={{
            zIndex: 50,
            position: 'absolute',
            bottom: 12,
            ...(isAr ? { right: 8 } : { left: 8 })
          }}
          color='primary'
        >
          <Icon fontSize='0.75rem' icon='bi:arrows-fullscreen' />
        </LoadingButton>
      )}
    </Box>
  )
}
