import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { isEmptyArray } from 'formik'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getUniqueId } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { galleryImageUpload, setWizardState } from 'src/store/apps/wizard'
import GalleryImageWidget from 'src/views/wizard/GalleryImageWidget'

export default function GalleryTab() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()

  const onChange = async (gallery: any) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          gallery
        }
      })
    )
  }

  const onImageChange = (image: any) => {
    const gallery = { ...wizard.details.gallery }
    gallery.image = image
    onChange(gallery)
  }

  const onUpload = async () => {
    let id = getUniqueId()
    const user = session?.user
    if (user && user.id) id = user.id
    dispatch(galleryImageUpload({ id, file: wizard.details.gallery.image }))
  }

  const onRemove = async (image: string) => {
    const images = wizard.details.gallery.images.filter((img: string) => img !== image)
    const gallery = { ...wizard.details.gallery }
    gallery.images = images
    onChange(gallery)
  }

  const onOpenImagesLibrary = () => {
    dispatch(
      setWizardState({
        ...wizard,
        imagesLibrary: {
          ...wizard.imagesLibrary,
          showUnsplashDialog: true,
          target: 'gallery'
        }
      })
    )
  }

  return (
    <TabPanel value='gallery' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <GalleryImageWidget
            title={t('upload_or_choose_file')}
            image={wizard.details.gallery.image}
            uploading={wizard.details.gallery.uploading}
            onChange={onChange}
            onImageChange={onImageChange}
            onUpload={onUpload}
            onOpenImagesLibrary={onOpenImagesLibrary}
          />
        </Grid>
      </Grid>

      {!isEmptyArray(wizard.details.gallery.images) && (
        <Box
          sx={{ width: '100%' }}
          display='flex'
          justifyContent='flex-start'
          alignItems='flex-start'
          gap={1}
          mt={24}
          mb={3}
        >
          <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{t('your_gallery')}</Typography>
        </Box>
      )}

      <Grid container spacing={2} justifyContent='flex-start'>
        {wizard.details.gallery.images.map((image: string) => (
          <Grid key={image} item xs={12} md={3}>
            <Box
              onClick={() => onRemove(image)}
              sx={{
                position: 'relative',
                flex: 1,
                width: '100%',
                height: 160,
                overflow: 'hidden',
                borderStyle: 'solid',
                borderWidth: 2,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0)',
                  transition: 'background-color 0.5s ease',
                  zIndex: 1
                },
                '&:hover::before': {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: theme.palette.error.main,
                  fontWeight: 600,
                  content: `"${t('remove')}"`
                },
                '&:hover img': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.5s ease'
                },
                ':hover': {
                  borderColor: theme.palette.error.main
                }
              }}
            >
              <img
                alt='AI Generated Image'
                style={{
                  objectFit: 'cover',
                  objectPosition: 'top',
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
                src={image}
              />

              <Icon
                style={{
                  color: theme.palette.primary.main,
                  position: 'absolute',
                  top: 8,
                  ...(isAr ? { left: 8 } : { right: 8 })
                }}
                fontSize='1.3rem'
                icon='ph:seal-check-fill'
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </TabPanel>
  )
}
