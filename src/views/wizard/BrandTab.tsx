import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUniqueId, isString, isUrl } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { logoDelete, logoUpload, setWizardState } from 'src/store/apps/wizard'
import AIGeneratedLogos from 'src/views/wizard/AIGeneratedLogos'
import WizardColorPicker from 'src/views/wizard/ColorPicker'
import FontFamilyPicker from 'src/views/wizard/FontFamilyPicker'
import LogoUploader from 'src/views/wizard/LogoUploader'

export default function BrandTab() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()
  const isUploaded = wizard.details.brand.logo && isUrl(wizard.details.brand.logo)

  const clearFile = () => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          brand: {
            ...wizard.details.brand,
            logo: null,
            aiLogo: null,
            type: null,
            dimensions: { width: 165, height: 165 }
          }
        }
      })
    )
  }

  const handleUploadFile = async () => {
    let id = getUniqueId()
    const user = session?.user
    if (user && user.id) id = user.id
    dispatch(logoUpload({ id, file: wizard.details.brand.logo }))
  }

  const handleDeleteFile = async () => {
    if (!isString(wizard.details.brand.logo)) {
      toast.error(t('no_file_selected'))

      return
    }

    dispatch(logoDelete({ file: wizard.details.brand.logo }))
  }

  return (
    <TabPanel value='brand' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} display='flex' justifyContent='flex-start' alignItems='flex-start' gap={4}>
          {(!wizard.details.brand.prompt && !wizard.details.brand.logo && !wizard.details.brand.aiLogo) ||
          (wizard.details.brand.logo && wizard.details.brand.type === 'upload') ? (
            <LogoUploader />
          ) : null}

          {!wizard.details.brand.logo && !wizard.details.brand.aiLogo && !wizard.details.brand.prompt && (
            <Box height='100%' display='flex' justifyContent='center' alignItems='center'>
              <Typography variant='body2' sx={{ opacity: 0.5 }}>
                {t('or')}
              </Typography>
            </Box>
          )}

          {!wizard.details.brand.logo || (wizard.details.brand.logo && wizard.details.brand.type === 'generate') ? (
            <AIGeneratedLogos
              title={`${t('ai_logo')} (${t('optional')})`}
              file={wizard.details.brand.logo}
              setFile={file =>
                dispatch(
                  setWizardState({
                    ...wizard,
                    details: { ...wizard.details, brand: { ...wizard.details.brand, logo: file, type: 'generate' } }
                  })
                )
              }
            />
          ) : null}
        </Grid>

        {wizard.details.brand.logo ? (
          <Grid item xs={12} display='flex' justifyContent='flex-start' alignItems='center' gap={2} marginTop={-3}>
            {!isUploaded && (
              <LoadingButton
                id='upload-button'
                data-testid='upload-button'
                variant='contained'
                loading={wizard.details.brand.uploading}
                disabled={wizard.details.brand.deleting}
                onClick={handleUploadFile}
              >
                {t('upload')}
              </LoadingButton>
            )}

            {isUrl(wizard.details.brand.logo) ? (
              <LoadingButton
                id='delete-button'
                data-testid='delete-button'
                variant='outlined'
                color='error'
                loading={wizard.details.brand.deleting}
                disabled={wizard.details.brand.uploading}
                onClick={handleDeleteFile}
              >
                {t('delete')}
              </LoadingButton>
            ) : (
              <Button
                onClick={clearFile}
                variant='outlined'
                color='secondary'
                disabled={wizard.details.brand.uploading}
              >
                {t('clear')}
              </Button>
            )}
          </Grid>
        ) : wizard.details.brand.aiLogo ? (
          <Grid item xs={12} display='flex' justifyContent='flex-start' alignItems='center' gap={2} marginTop={-3}>
            <Button onClick={clearFile} variant='outlined' color='secondary'>
              {t('clear')}
            </Button>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <WizardColorPicker />
        </Grid>

        <Grid item xs={12}>
          <FontFamilyPicker
            title={t('font_family')}
            fontFamily={wizard.details.brand.fontFamily}
            setFontFamily={font =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    brand: { ...wizard.details.brand, fontFamily: font }
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
