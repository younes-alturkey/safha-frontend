import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'
import NewService from 'src/views/wizard/NewService'

export default function ServicesTab() {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onServicesChange = async (services: Array<any>) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          services
        }
      })
    )
  }

  const onNew = () => {
    const service = {
      title: '',
      description: ''
    }
    const services = [...wizard.details.services, service]
    onServicesChange(services)
  }

  const onRemove = async (index: number) => {
    const services = wizard.details.services.filter((_: any, i: number) => i !== index)
    onServicesChange(services)
  }

  return (
    <TabPanel value='services' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <LoadingButton onClick={onNew} id='add-button' data-testid='add-button' variant='outlined' color='primary'>
            {t('add_service')}
          </LoadingButton>
        </Grid>
        {wizard.details.services.map((service: any, index: number) => (
          <NewService
            key={`service${index}`}
            index={index}
            service={service}
            services={wizard.details.services}
            onChange={onServicesChange}
            onRemove={onRemove}
          />
        ))}
      </Grid>
    </TabPanel>
  )
}
