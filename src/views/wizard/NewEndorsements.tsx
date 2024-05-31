import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import CustomTextField from 'src/@core/components/mui/text-field'

type Endorsement = {
  name: string
  endorsement: string
}

interface NewEndorsementsProps {
  index: number
  endorsement: Endorsement
  endorsements: Array<Endorsement>
  onChange: (testimonial: Array<any>) => Promise<void>
  onRemove: (index: number) => Promise<void>
}

export default function NewEndorsements(props: NewEndorsementsProps) {
  const { t } = useTranslation()

  const onFieldUpdate = (field: string, value: string) => {
    const endorsement = { ...props.endorsements[props.index] } as any
    endorsement[field] = value
    const endorsements = [...props.endorsements]
    endorsements[props.index] = endorsement
    props.onChange(endorsements)
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
          label={t('person_name')}
          placeholder={t('younes_alturkey') as string}
          value={props.endorsement.name}
          onChange={e => onFieldUpdate('name', e.target.value)}
        />

        <CustomTextField
          fullWidth
          multiline
          minRows={4}
          label={t('endorsement')}
          placeholder={t('endorsement_placeholder') as string}
          value={props.endorsement.endorsement}
          onChange={e => onFieldUpdate('endorsement', e.target.value)}
        />

        <LoadingButton
          onClick={() => props.onRemove(props.index)}
          id='delete-button'
          data-testid='delete-button'
          variant='outlined'
          color='secondary'
        >
          {t('remove_endorsement')}
        </LoadingButton>
      </Box>
    </Grid>
  )
}
