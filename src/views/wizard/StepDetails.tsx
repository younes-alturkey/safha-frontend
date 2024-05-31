import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import { SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'
import AboutTab from 'src/views/wizard/AboutTab'
import BrandTab from 'src/views/wizard/BrandTab'
import EndorsementsTab from 'src/views/wizard/EndorsementsTab'
import GalleryTab from 'src/views/wizard/GalleryTab'
import ProductsTab from 'src/views/wizard/ProductsTab'
import ProjectsTab from 'src/views/wizard/ProjectsTab'
import PromptSummary from 'src/views/wizard/PromptSummary'
import ServicesTab from 'src/views/wizard/ServicesTab'
import TeamTab from 'src/views/wizard/TeamTab'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 81,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const StepDetails = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: { ...wizard.details, active: newValue }
      })
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <TabContext value={wizard.details.active}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleTabChange}
            aria-label='customized info tabs'
          >
            <Tab sx={{ fontSize: '0.75rem' }} value='brand' label={t('brand')} />
            {wizard.sections.map((section: string) => (
              <Tab sx={{ fontSize: '0.75rem' }} key={section} value={section} label={t(section)} />
            ))}
          </TabList>
          <Grid container sx={{ mt: 6 }}>
            <Grid item md={8} xs={12}>
              <BrandTab />
              <AboutTab />
              <TeamTab />
              <ServicesTab />
              <ProjectsTab />
              <ProductsTab />
              <EndorsementsTab />
              <GalleryTab />
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
      <PromptSummary />
    </Grid>
  )
}

export default StepDetails
