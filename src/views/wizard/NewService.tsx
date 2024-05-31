import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'

type Service = {
  title: string
  description: string
}

interface NewServiceProps {
  index: number
  service: Service
  services: Array<Service>
  onChange: (services: Array<any>) => Promise<void>
  onRemove: (index: number) => Promise<void>
}

export default function NewService(props: NewServiceProps) {
  const { t } = useTranslation()

  const onFieldUpdate = (field: string, value: string) => {
    const service = { ...props.services[props.index] } as any
    service[field] = value
    const services = [...props.services]
    services[props.index] = service
    props.onChange(services)
  }

  return (
    <Grid item xs={12} lg={6} display='flex' justifyContent='flex-start' alignItems='flex-start' gap={4}>
      <Box
        sx={{ width: '100%' }}
        display='flex'
        flexDirection='column'
        justifyContent='flex-start'
        alignItems='flex-start'
        gap={4}
      >
        <CustomTextField
          fullWidth
          label={t('service_title')}
          placeholder={t('plumbing_services') as string}
          value={props.service.title}
          onChange={e => onFieldUpdate('title', e.target.value)}
        />

        <CustomTextField
          fullWidth
          multiline
          minRows={4}
          label={t('service_desc')}
          placeholder={t('plumbing_services_desc') as string}
          value={props.service.description}
          onChange={e => onFieldUpdate('description', e.target.value)}
        />

        <LoadingButton
          onClick={() => props.onRemove(props.index)}
          id='delete-button'
          data-testid='delete-button'
          variant='outlined'
          color='secondary'
        >
          {t('remove_service')}
        </LoadingButton>
      </Box>
    </Grid>
  )
}
