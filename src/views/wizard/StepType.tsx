import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomCheckboxIcons from 'src/@core/components/custom-checkbox/icons'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import { CustomRadioIconsData, CustomRadioIconsProps } from 'src/@core/components/custom-radio/types'
import CustomChip from 'src/@core/components/mui/chip'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'
import PromptSummary from 'src/views/wizard/PromptSummary'

interface IconType {
  icon: CustomRadioIconsProps['icon']
  iconProps: CustomRadioIconsProps['iconProps']
}

const StepType = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const theme = useTheme()
  const { t } = useTranslation()

  const languageIcons: CustomRadioIconsData[] = [
    {
      isSelected: true,
      value: 'en',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('english')}
        </Typography>
      ),
      content: null
    },
    {
      value: 'ar',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('arabic')}
        </Typography>
      ),
      content: null
    }
  ]

  const languages: IconType[] = [
    {
      icon: 'icon-park-outline:english',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'mdi:abjad-arabic',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    }
  ]

  const typeIcons: CustomRadioIconsData[] = [
    {
      isSelected: true,
      value: 'portfolio',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('portfolio')}
        </Typography>
      ),
      content: (
        <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
          {t('for_personal_and_professional_use')}
        </Typography>
      )
    },
    {
      value: 'business',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('business')}
        </Typography>
      ),
      content: (
        <>
          <CustomChip
            rounded
            label={t('new')}
            size='small'
            skin='light'
            color='primary'
            sx={{ top: 12, right: 12, position: 'absolute' }}
          />
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('for_businessnes_of_all_sizes')}
          </Typography>
        </>
      )
    }
  ]

  const types: IconType[] = [
    {
      icon: 'tabler:users',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'ic:baseline-business',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'ep:suitcase-line',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'fluent-mdl2:special-event',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    }
  ]

  const sectionIcons: CustomRadioIconsData[] = [
    {
      value: 'team',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('team_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('team_section_desc')}
          </Typography>
        </>
      )
    },
    {
      value: 'services',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('services_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('services_section_desc')}
          </Typography>
        </>
      )
    },
    {
      value: 'projects',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('projects_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('projects_section_desc')}
          </Typography>
        </>
      )
    },
    {
      value: 'products',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('products_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('products_section_desc')}
          </Typography>
        </>
      )
    },
    {
      value: 'endorsements',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('endorsements_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('endorsements_section_desc')}
          </Typography>
        </>
      )
    },
    {
      value: 'gallery',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          {t('gallery_section')}
        </Typography>
      ),
      content: (
        <>
          <Typography variant='body2' sx={{ my: 'auto', textAlign: 'center' }}>
            {t('gallery_section_desc')}
          </Typography>
        </>
      )
    }
  ]

  const sections: IconType[] = [
    {
      icon: 'fluent-mdl2:teamwork',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'mdi:customer-service',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'carbon:ibm-cloud-projects',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'material-symbols:shoppingmode-outline',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'tdesign:cooperate',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'fluent-mdl2:media-add',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'tabler:message-up',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    }
  ]

  const handleLanguageChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    if (value === wizard.language) {
      dispatch(setWizardState({ ...wizard, language: '' }))
    } else {
      dispatch(setWizardState({ ...wizard, language: value }))
    }
  }

  const handleTypeChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    if (value === wizard.type) {
      dispatch(setWizardState({ ...wizard, type: '' }))
    } else {
      dispatch(setWizardState({ ...wizard, type: value }))
    }
  }

  const handleSectionsChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    if (wizard.sections.includes(value)) {
      const sections = wizard.sections.filter((section: string) => section !== value)
      dispatch(setWizardState({ ...wizard, sections }))
    } else {
      const sections = [...wizard.sections, value]
      dispatch(setWizardState({ ...wizard, sections }))
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Typography variant='h6'>{t('choose_website_language')}</Typography>
        <Grid container spacing={4} marginTop={2} marginBottom={8}>
          {languageIcons.map((_, index) => (
            <CustomRadioIcons
              key={index}
              data={languageIcons[index]}
              icon={languages[index].icon}
              selected={wizard.language}
              name='custom-radios-types'
              gridProps={{ sm: 4, xs: 12 }}
              iconProps={languages[index].iconProps}
              handleChange={handleLanguageChange}
            />
          ))}
        </Grid>
        <Typography variant='h6'>{t('choose_website_type')}</Typography>
        <Grid container spacing={4} marginTop={2} marginBottom={8}>
          {typeIcons.map((_, index) => (
            <CustomRadioIcons
              key={index}
              data={typeIcons[index]}
              icon={types[index].icon}
              selected={wizard.type}
              name='custom-radios-types'
              gridProps={{ sm: 4, xs: 12 }}
              iconProps={types[index].iconProps}
              handleChange={handleTypeChange}
            />
          ))}
        </Grid>
        <Typography variant='h6'>{t('add_website_sections')}</Typography>
        <Grid container spacing={4} marginTop={2}>
          {sectionIcons.map((_, index) => (
            <CustomCheckboxIcons
              key={index + 3}
              data={sectionIcons[index]}
              icon={sections[index].icon}
              selected={wizard.sections}
              name='custom-radios-sections'
              gridProps={{ sm: 4, xs: 12 }}
              iconProps={sections[index].iconProps}
              handleChange={handleSectionsChange}
            />
          ))}
        </Grid>
      </Grid>
      <PromptSummary />
    </Grid>
  )
}

export default StepType
