import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { createObjectURL, isUrl, toMb } from 'src/@core/utils'

interface FileProp {
  name: string
  type: string
  size: number
}

interface MediaUploaderProps {
  title?: string
  file: any
  isUploaded: boolean
  accept: Accept
  uploading: boolean
  deleting: boolean
  disabled: boolean
  onFileChange: (file: FileProp) => void
  onUpload: () => Promise<void>
  onDelete: () => Promise<void>
  onClear: () => void
}

export default function SingleMediaUploader(props: MediaUploaderProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [isContain, setIsContain] = useState(false)

  function toggleContain() {
    setIsContain(!isContain)
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: props.accept,
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) {
        toast.error(t('no_file_selected'))

        return
      }

      if (file.size > toMb(50)) {
        toast.error(t('file_size_greater_than_50_mb'))

        return
      }

      props.onFileChange(Object.assign(acceptedFiles[0]))
    }
  })

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
          {...getRootProps({ className: 'dropzone' })}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          <input {...getInputProps()} />
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
                {t('drag_and_drop')}
              </Typography>
            </Box>
          )}

          {props.isUploaded && (
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

      {!props.file ? (
        <Box
          sx={{
            width: '100%',
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant='body2' textAlign='center' sx={{ opacity: 0.5 }}>
            {t('50_mb_max')}
          </Typography>
        </Box>
      ) : (
        <Grid item xs={12} display='flex' justifyContent='flex-start' alignItems='center' gap={2} marginTop={2.6}>
          {!props.isUploaded && (
            <LoadingButton
              id='upload-button'
              data-testid='upload-button'
              variant='contained'
              loading={props.uploading}
              disabled={props.deleting || props.disabled}
              onClick={props.onUpload}
            >
              {t('upload')}
            </LoadingButton>
          )}

          {isUrl(props.file) ? (
            <LoadingButton
              id='delete-button'
              data-testid='delete-button'
              variant='outlined'
              color='error'
              loading={props.deleting}
              disabled={props.uploading || props.disabled}
              onClick={props.onDelete}
            >
              {t('delete_photo')}
            </LoadingButton>
          ) : (
            <Button
              onClick={props.onClear}
              variant='outlined'
              color='secondary'
              disabled={props.uploading || props.disabled}
            >
              {t('clear')}
            </Button>
          )}
        </Grid>
      )}

      {props.file && (
        <LoadingButton
          onClick={toggleContain}
          style={{
            zIndex: 50,
            position: 'absolute',
            bottom: 64,
            ...(isAr ? { right: 12 } : { left: 12 })
          }}
          color='primary'
        >
          <Icon fontSize='0.75rem' icon='bi:arrows-fullscreen' />
        </LoadingButton>
      )}
    </Box>
  )
}
