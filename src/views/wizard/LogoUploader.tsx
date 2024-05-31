import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { canCreateObjectURL, createObjectURL, isUrl, resizeDimensions, toMb } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'

export interface FileProp {
  name: string
  type: string
  size: number
}

const LogoUploader = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isUploaded = wizard.details.brand.logo && isUrl(wizard.details.brand.logo)

  const handleSetFile = (file: any) => {
    const details = { ...wizard.details, brand: { ...wizard.details.brand, logo: file, type: 'upload' } }
    const objectURL = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const resized = resizeDimensions(img.naturalWidth, img.naturalHeight)
      dispatch(
        setWizardState({
          ...wizard,
          details: {
            ...details,
            brand: { ...details.brand, dimensions: { width: resized.width, height: resized.height } }
          }
        })
      )
      URL.revokeObjectURL(objectURL)
    }
    img.src = objectURL

    dispatch(
      setWizardState({
        ...wizard,
        details
      })
    )
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
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

      handleSetFile(Object.assign(acceptedFiles[0]))
    }
  })

  return (
    <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' gap={1}>
      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{`${t('your_logo')} (${t(
          'optional'
        )})`}</Typography>
      </Box>

      <Box
        sx={{
          width: wizard.details.brand.dimensions.width,
          height: wizard.details.brand.dimensions.height,
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
          {wizard.details.brand.logo &&
          (isUrl(wizard.details.brand.logo) || canCreateObjectURL(wizard.details.brand.logo)) ? (
            <img
              key={wizard.details.brand.logo.name}
              alt={wizard.details.brand.logo.name}
              style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
              src={
                isUrl(wizard.details.brand.logo)
                  ? (wizard.details.brand.logo as any)
                  : createObjectURL(wizard.details.brand.logo as any)
              }
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

          {isUploaded && (
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

      {!wizard.details.brand.logo && (
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
      )}
    </Box>
  )
}

export default LogoUploader
