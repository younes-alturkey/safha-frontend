import LoadingButton from '@mui/lab/LoadingButton'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Theme, styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import {
  isEndorsementsFilled,
  isProductsFilled,
  isProjectsFilled,
  isServicesFilled,
  isTeamFilled,
  isUrl
} from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { deleteWebsite, generateWebsite, setWizardState, wizardInitialState } from 'src/store/apps/wizard'

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 48,
  height: 48,
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

export default function PromptSummary() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const router = useRouter()
  const breakpointMD = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'lg'))
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const languageIsCompleted = Boolean(wizard.language)

  const typeIsCompleted = Boolean(wizard.type)

  const sectionsIsCompleted = Boolean(wizard.sections && wizard.sections.length > 0)

  const brandIsCompleted = Boolean(wizard.details.brand.primaryColor && wizard.details.brand.fontFamily)

  const aboutIsCompleted = Boolean(
    wizard.details.about.name &&
      wizard.details.about.email &&
      wizard.details.about.phoneNumber &&
      wizard.details.about.location &&
      wizard.details.about.whatDoYouDo
  )

  const teamIsCompleted = wizard.details.team.length > 0 && isTeamFilled(wizard.details.team)

  const servicesIsCompleted = wizard.details.services.length > 0 && isServicesFilled(wizard.details.services)

  const projectsIsCompleted = wizard.details.projects.length > 0 && isProjectsFilled(wizard.details.projects)

  const productsIsCompleted = wizard.details.products.length > 0 && isProductsFilled(wizard.details.products)

  const endorsementsIsCompleted =
    wizard.details.endorsements.length > 0 && isEndorsementsFilled(wizard.details.endorsements)

  const galleryIsCompleted = wizard.details.gallery.images.length > 0

  const isDisabled =
    wizard.generating ||
    wizard.generated ||
    (wizard.step === 0 && (!typeIsCompleted || !sectionsIsCompleted || !languageIsCompleted)) ||
    (wizard.step === 1 &&
      (!brandIsCompleted ||
        (wizard.sections.includes('about') && !aboutIsCompleted) ||
        (wizard.sections.includes('team') && !teamIsCompleted) ||
        (wizard.sections.includes('services') && !servicesIsCompleted) ||
        (wizard.sections.includes('projects') && !projectsIsCompleted) ||
        (wizard.sections.includes('products') && !productsIsCompleted) ||
        (wizard.sections.includes('endorsements') && !endorsementsIsCompleted) ||
        (wizard.sections.includes('gallery') && !galleryIsCompleted)))

  const readyToGenerate =
    wizard.step === 2 &&
    languageIsCompleted &&
    typeIsCompleted &&
    sectionsIsCompleted &&
    brandIsCompleted &&
    (wizard.sections.includes('about') ? aboutIsCompleted : true) &&
    (wizard.sections.includes('team') ? teamIsCompleted : true) &&
    (wizard.sections.includes('services') ? servicesIsCompleted : true) &&
    (wizard.sections.includes('projects') ? projectsIsCompleted : true) &&
    (wizard.sections.includes('products') ? productsIsCompleted : true) &&
    (wizard.sections.includes('endorsements') ? endorsementsIsCompleted : true) &&
    (wizard.sections.includes('gallery') ? galleryIsCompleted : true)

  const onNext = () => dispatch(setWizardState({ ...wizard, step: wizard.step + 1 }))

  const onPrevious = () => dispatch(setWizardState({ ...wizard, step: wizard.step - 1 }))

  const handleGenerateWebsite = async () => {
    await dispatch(generateWebsite({ wizard, session }))
    toast.success(t('successfully_generated_your_website'), {
      duration: 7500
    })
  }

  const handleManageWebsite = () => {
    router.push({ pathname: '/signup' })
  }

  const handleDeleteWebsite = async () => {
    const delOp = await dispatch(deleteWebsite({}))
    if (delOp.meta.requestStatus === 'fulfilled') {
      await dispatch(setWizardState(wizardInitialState))
      toast.success(t('website_deleted_successfully'), {
        duration: 7500
      })
    } else {
      toast.error(t('something_went_wrong'))
    }
  }

  return (
    <Grid item xs={12} lg={4}>
      <Box sx={{ mb: 4, borderRadius: 1, border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Typography sx={{ mb: 4 }} variant='h6'>
            {t('prompt_summary')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{t('language')}</Typography>
              {languageIsCompleted ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color='primary' label={t(wizard.language)} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color={'warning'} label={t('missing')} />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{t('type')}</Typography>
              {typeIsCompleted ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color='primary' label={t(wizard.type)} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color={'warning'} label={t('missing')} />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{t('sections')}</Typography>
              {sectionsIsCompleted ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color='primary'
                    label={`${wizard.sections.length} ${t('sections_singular')}`}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color={'warning'} label={t('missing')} />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography>{t('brand')}</Typography>

              {brandIsCompleted ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    gap: 1
                  }}
                >
                  {isUrl(wizard.details.brand.logo || wizard.details.brand.aiLogo) && (
                    <Box
                      sx={{
                        p: 0.3,
                        borderRadius: 1,
                        overflow: 'hidden',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderColor: isDark ? theme.palette.grey[700] : theme.palette.grey[300],
                        width: 48,
                        height: 48
                      }}
                    >
                      <img
                        alt='Website brand logo preview'
                        style={{
                          borderRadius: 6,
                          objectFit: 'contain',
                          objectPosition: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                        src={
                          isUrl(wizard.details.brand.logo || wizard.details.brand.aiLogo)
                            ? wizard.details.brand.logo || wizard.details.brand.aiLogo
                            : URL.createObjectURL(wizard.details.brand.logo || wizard.details.brand.aiLogo)
                        }
                      />
                    </Box>
                  )}

                  <ColorBox
                    sx={{
                      backgroundColor: wizard.details.brand.primaryColor
                    }}
                  />

                  <CustomChip
                    sx={{ height: 48 }}
                    rounded
                    size='small'
                    skin='light'
                    color='secondary'
                    label={t(wizard.details.brand.fontFamily)}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip rounded size='small' skin='light' color={'warning'} label={t('missing')} />
                </Box>
              )}
            </Box>
          </Box>
          {wizard.sections.includes('about') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('about')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={aboutIsCompleted ? 'primary' : 'warning'}
                    label={aboutIsCompleted ? t('completed') : t('missing')}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('team') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('team')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={teamIsCompleted ? 'primary' : 'warning'}
                    label={teamIsCompleted ? `${t('completed')} (${wizard.details.team.length})` : t('missing')}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('services') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('services')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={servicesIsCompleted ? 'primary' : 'warning'}
                    label={servicesIsCompleted ? `${t('completed')} (${wizard.details.services.length})` : t('missing')}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('projects') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('projects')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={projectsIsCompleted ? 'primary' : 'warning'}
                    label={projectsIsCompleted ? `${t('completed')} (${wizard.details.projects.length})` : t('missing')}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('products') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('products')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={productsIsCompleted ? 'primary' : 'warning'}
                    label={productsIsCompleted ? `${t('completed')} (${wizard.details.products.length})` : t('missing')}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('endorsements') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('endorsements')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={endorsementsIsCompleted ? 'primary' : 'warning'}
                    label={
                      endorsementsIsCompleted
                        ? `${t('completed')} (${wizard.details.endorsements.length})`
                        : t('missing')
                    }
                  />
                </Box>
              </Box>
            </Box>
          )}
          {wizard.sections.includes('gallery') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography>{t('gallery')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    color={galleryIsCompleted ? 'primary' : 'warning'}
                    label={
                      galleryIsCompleted ? `${t('added')} (${wizard.details.gallery.images.length})` : t('missing')
                    }
                  />
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Box>
      {wizard.generated ? (
        <Box sx={{ display: 'flex', gap: 4, ...(breakpointMD ? { justifyContent: 'flex-end' } : {}) }}>
          <Button
            fullWidth={!breakpointMD}
            variant='contained'
            onClick={handleManageWebsite}
            disabled={wizard.deleting}
          >
            {t('create_your_account_now')}
          </Button>
          <LoadingButton
            fullWidth={!breakpointMD}
            variant='contained'
            color='error'
            onClick={handleDeleteWebsite}
            loading={wizard.deleting}
          >
            {t('delete')}
          </LoadingButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 4, ...(breakpointMD ? { justifyContent: 'flex-end' } : {}) }}>
          <Button
            sx={{ visibility: wizard.step === 0 ? 'hidden' : 'visible' }}
            fullWidth={!breakpointMD}
            variant='text'
            color='secondary'
            onClick={onPrevious}
            disabled={wizard.generating || wizard.generated}
          >
            {t('back')}
          </Button>
          <LoadingButton
            fullWidth={!breakpointMD}
            variant='contained'
            onClick={readyToGenerate ? handleGenerateWebsite : onNext}
            disabled={isDisabled}
            loading={wizard.generating}
          >
            {readyToGenerate ? t('generate') : t('continue')}
          </LoadingButton>
        </Box>
      )}
    </Grid>
  )
}
