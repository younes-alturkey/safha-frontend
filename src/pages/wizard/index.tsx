import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { Theme, styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps } from 'next/types'
import { useEffect } from 'react'
import 'react-credit-cards/es/styles-compiled.css'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import UnsplashDialog from 'src/@core/components/unsplash-dialog'
import { useSettings } from 'src/@core/hooks/useSettings'
import ContainerLayout from 'src/@core/layouts/ContainerLayout'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import {
  canCreateObjectURL,
  compareVersionStrings,
  deepCompare,
  isUrl,
  modeToggle,
  sleep,
  switchLocale
} from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { setWizardState, wizardInitialState } from 'src/store/apps/wizard'
import { APP_VERSION_BUILD } from 'src/types/constants'
import ResetWizardDialog from 'src/views/wizard/ResetWizardDialog'
import StepDetails from 'src/views/wizard/StepDetails'
import StepLive from 'src/views/wizard/StepLive'
import StepType from 'src/views/wizard/StepType'

const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  margin: 'auto',
  maxWidth: 800,
  justifyContent: 'space-around',

  '& .MuiStep-root': {
    cursor: 'default',
    textAlign: 'center',
    '&:not(:last-child)': {
      paddingBottom: theme.spacing(8)
    },
    '&.Mui-completed + svg': {
      color: theme.palette.primary.main
    },
    '& + svg': {
      display: 'none',
      color: theme.palette.text.disabled
    },

    '& .MuiStepLabel-label': {
      display: 'flex',
      cursor: 'default',
      alignItems: 'center',
      svg: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(0.75),
        fill: theme.palette.text.primary
      },
      '&.Mui-active, &.Mui-completed': {
        '& .MuiTypography-root': {
          color: theme.palette.primary.main
        },
        '& svg': {
          fill: theme.palette.primary.main
        }
      }
    },

    '& .step-title': {
      fontWeight: 400
    },

    [theme.breakpoints.up('md')]: {
      paddingBottom: '0 !important',
      '& + svg': {
        display: 'block'
      },
      '& .MuiStepLabel-label': {
        display: 'block'
      }
    }
  }
}))

const WizardPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t, i18n } = useTranslation()
  const { settings, saveSettings } = useSettings()
  const isDark = settings.mode === 'dark'
  const logo = isDark ? `/logo-white.png` : `/logo-black.png`
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { direction } = settings

  const steps = [
    {
      title: t('type'),
      icon: (
        <svg
          fontSize='60'
          className='iconify iconify--material-symbols-light'
          width='1.2em'
          height='1.2em'
          viewBox='0 0 24 24'
        >
          <path
            fillRule='nonzero'
            d='M2.346 11.462V10.23h1.23v1.23zm18.077 0V10.23h1.23v1.23zM2.346 7.846v-1.23h1.23v1.23zm18.077 0v-1.23h1.23v1.23zM2.346 4.231V3h1.23v1.23zm3.616 7.23v-1.23h1.23v1.23zm10.846 0v-1.23h1.23v1.23zm3.615-7.23V3h1.23v1.23zm-14.461 0V3h1.23v1.23zm3.615 0V3h1.23v1.23zm3.615 0V3h1.231v1.23zm3.616 0V3h1.23v1.23zm-5.14 17.25q-.5 0-.945-.187q-.444-.186-.807-.546l-4.354-4.344l1.003-1.029l2.781.627V7.5h1v9.825l-3.238-.815l3.498 3.536q.227.227.488.33q.262.105.577.105h3.483q1.031 0 1.765-.735t.735-1.765v-3.673h1v3.673q0 1.457-1.021 2.479t-2.48 1.02zm.447-6.423v-4.52h1v4.52zm2.77 0v-2.904h1v2.904zm.269 5.423h-4.548z'
          ></path>
        </svg>
      )
    },
    {
      title: t('details'),
      icon: (
        <svg fontSize='60' width='1.2em' height='1.2em' viewBox='0 0 24 24'>
          <path
            fillRule='nonzero'
            d='M11.998 11.885q-1.042 0-1.77-.728T9.5 9.387q0-1.022.728-1.762t1.77-.74q1.021 0 1.762.74q.74.74.74 1.762q0 1.042-.74 1.77t-1.762.728m.002-1q.617 0 1.059-.432q.441-.43.441-1.068q0-.618-.441-1.059q-.442-.441-1.069-.441t-1.058.44q-.432.442-.432 1.07t.431 1.058q.432.432 1.069.432m-5.5 6.23v-1.4q0-.402.206-.756t.557-.565q1.074-.636 2.278-.957q1.205-.322 2.459-.322t2.459.322q1.204.32 2.278.957q.352.21.557.565t.206.756v1.4zm5.5-3q-1.121 0-2.25.327t-2.215.943v.75h8.93v-.77q-1.067-.615-2.205-.932q-1.139-.318-2.26-.318m0 2.02h4.465h-8.93zM4.622 21q-.697 0-1.16-.462Q3 20.075 3 19.378V16h1v3.385q0 .23.192.423q.193.192.423.192H8v1zM3 8V4.622q0-.697.463-1.16Q3.925 3 4.622 3H8v1H4.615q-.23 0-.423.192Q4 4.385 4 4.615V8zm13 13v-1h3.385q.23 0 .423-.192q.192-.193.192-.423V16h1v3.378q0 .697-.462 1.16q-.463.462-1.16.462zm4-13V4.615q0-.23-.192-.423Q19.615 4 19.385 4H16V3h3.378q.697 0 1.16.463q.462.462.462 1.159V8z'
          />
        </svg>
      )
    },
    {
      title: t('live'),
      icon: (
        <svg fontSize='60' width='1.2em' height='1.2em' viewBox='0 0 24 24'>
          <path
            fillRule='nonzero'
            d='m10.562 15.908 6.396-6.396-.708-.708-5.688 5.688-2.85-2.85-.708.708zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21M12 20q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8'
          />
        </svg>
      )
    }
  ]

  const handleSwitchLocale = async () => {
    await switchLocale(settings, saveSettings, i18n)
  }

  const handleModeToggle = async () => {
    modeToggle(settings, saveSettings)
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepType />
      case 1:
        return <StepDetails />
      case 2:
        return <StepLive />
      default:
        return null
    }
  }

  const renderContent = () => {
    return getStepContent(wizard.step)
  }

  function onShowUnsplashDialog(show: boolean) {
    dispatch(setWizardState({ ...wizard, imagesLibrary: { ...wizard.imagesLibrary, showUnsplashDialog: show } }))
  }

  function onUnsplashDialogSelect(image: string) {
    switch (wizard.imagesLibrary.target) {
      case 'projects':
        const project = { ...wizard.details.projects[wizard.imagesLibrary.index] }
        project.image = image
        const projects = [...wizard.details.projects]
        projects[wizard.imagesLibrary.index] = project
        dispatch(
          setWizardState({
            ...wizard,
            details: {
              ...wizard.details,
              projects
            },
            imagesLibrary: { ...wizard.imagesLibrary, showUnsplashDialog: false }
          })
        )
        break
      case 'products':
        const product = { ...wizard.details.products[wizard.imagesLibrary.index] }
        product.image = image
        const products = [...wizard.details.products]
        products[wizard.imagesLibrary.index] = product
        dispatch(
          setWizardState({
            ...wizard,
            details: {
              ...wizard.details,
              products
            },
            imagesLibrary: { ...wizard.imagesLibrary, showUnsplashDialog: false }
          })
        )
        break
      case 'gallery':
        const gallery = { ...wizard.details.gallery }
        gallery.images = [...gallery.images, image]
        dispatch(
          setWizardState({
            ...wizard,
            details: {
              ...wizard.details,
              gallery
            },
            imagesLibrary: { ...wizard.imagesLibrary, showUnsplashDialog: false }
          })
        )
        break
      default:
        break
    }
  }

  function onUnsplashDialogImages(images: Array<any>) {
    dispatch(setWizardState({ ...wizard, imagesLibrary: { ...wizard.imagesLibrary, images } }))
  }

  async function onInit() {
    const wizardStateKey = 'wizard_state:version'
    const wizardStateVersionFromStorage = localStorage.getItem(wizardStateKey)
    const wizardStateVersion = wizardStateVersionFromStorage ? JSON.parse(wizardStateVersionFromStorage) : null
    if (wizardStateVersion) {
      const isNewer = compareVersionStrings(wizardStateVersion, APP_VERSION_BUILD) === 1
      if (isNewer) {
        localStorage.setItem(wizardStateKey, JSON.stringify(APP_VERSION_BUILD))
        await sleep(1)
        await dispatch(setWizardState(wizardInitialState))

        return
      }
    } else {
      localStorage.setItem(wizardStateKey, JSON.stringify(APP_VERSION_BUILD))
    }

    const isFresh = deepCompare(wizard, wizardInitialState)
    let showResetDialog = false
    if (!wizard.generated && !isFresh) {
      showResetDialog = true
      await dispatch(setWizardState({ ...wizard, showResetDialog }))
    }

    let details = wizard.details
    if (
      wizard.details.brand.logo &&
      !isUrl(wizard.details.brand.logo) &&
      !canCreateObjectURL(wizard.details.brand.logo)
    ) {
      details = {
        ...details,
        brand: { ...details.brand, logo: null, type: null, dimensions: { width: 165, height: 165 } }
      }
      dispatch(
        setWizardState({
          ...wizard,
          details,
          showResetDialog
        })
      )
    }
    const teamPhotos = wizard.details.team.map((member: any) => member.photo)
    const invalidPhotos = teamPhotos.filter((photo: any) => !isUrl(photo) && !canCreateObjectURL(photo))
    const team = wizard.details.team.map((member: any) => {
      if (invalidPhotos.includes(member.photo)) return { ...member, photo: null }

      return member
    })

    const projectImages = wizard.details.projects.map((project: any) => project.image)
    const invalidProjectImages = projectImages.filter((image: any) => !isUrl(image) && !canCreateObjectURL(image))
    const projects = wizard.details.projects.map((project: any) => {
      if (invalidProjectImages.includes(project.image))
        return { ...project, image: null, imageType: null, generating: false, deleting: false, uploading: false }

      return project
    })

    const productImages = wizard.details.products.map((product: any) => product.image)
    const invalidProductImages = productImages.filter((image: any) => !isUrl(image) && !canCreateObjectURL(image))
    const products = wizard.details.products.map((product: any) => {
      if (invalidProductImages.includes(product.image))
        return { ...product, image: null, imageType: null, generating: false, deleting: false, uploading: false }

      return product
    })

    dispatch(
      setWizardState({
        ...wizard,
        details: { ...details, team, projects, products },
        showResetDialog
      })
    )
  }

  useEffect(() => {
    onInit()
  }, [])

  return (
    <ContainerLayout>
      <Head>
        <title>{t('page_title_wizard')}</title>
      </Head>

      <CardContent sx={{ py: 11.5 }}>
        <StepperWrapper>
          <Stepper
            activeStep={wizard.step}
            connector={
              !smallScreen ? (
                <Icon fontSize='1.5rem' icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} />
              ) : null
            }
          >
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel icon={null}>
                    {step.icon}
                    <Typography className='step-title'>{step.title}</Typography>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />
      <CardContent>{renderContent()}</CardContent>

      <IconButton
        id='locale-switch-button'
        data-testid='locale-switch-button'
        sx={{ position: 'absolute', top: 0, right: 0, m: 2 }}
        onClick={handleSwitchLocale}
        onMouseDown={e => e.preventDefault()}
        aria-label='switch app locale'
      >
        <Icon fontSize='1.25rem' icon={'fa6-solid:language'} />
      </IconButton>
      <IconButton
        id='theme-toggle-button'
        data-testid='theme-toggle-button'
        sx={{ position: 'absolute', top: 0, right: 36, m: 2 }}
        onClick={handleModeToggle}
        onMouseDown={e => e.preventDefault()}
        aria-label='switch mode theme'
      >
        <Icon fontSize='1.25rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
      </IconButton>
      <Box sx={{ position: 'absolute', top: 0, left: 0, m: 2, opacity: 0.7 }}>
        <Link href='/'>
          <Image
            src={logo}
            priority
            alt='Safha Logo'
            width={68}
            height={34}
            style={{ opacity: isDark ? '70%' : '100%' }}
          />
        </Link>
      </Box>

      <UnsplashDialog
        show={wizard.imagesLibrary.showUnsplashDialog}
        images={wizard.imagesLibrary.images}
        onShow={onShowUnsplashDialog}
        onSelect={onUnsplashDialogSelect}
        setImages={onUnsplashDialogImages}
      />
      <ResetWizardDialog />
    </ContainerLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  }
}

export default WizardPage
