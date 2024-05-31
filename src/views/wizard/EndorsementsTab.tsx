import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'
import NewEndorsements from 'src/views/wizard/NewEndorsements'

export default function EndorsementsTab() {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onChange = async (endorsements: Array<any>) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          endorsements
        }
      })
    )
  }

  const onNew = () => {
    const endorsement = {
      name: '',
      endorsement: ''
    }
    const endorsements = [...wizard.details.endorsements, endorsement]
    onChange(endorsements)
  }

  const onRemove = async (index: number) => {
    const endorsements = wizard.details.endorsements.filter((_: any, i: number) => i !== index)
    onChange(endorsements)
  }

  return (
    <TabPanel value='endorsements' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <LoadingButton onClick={onNew} id='add-button' data-testid='add-button' variant='outlined' color='primary'>
            {t('add_endorsement')}
          </LoadingButton>
        </Grid>
        {wizard.details.endorsements.map((endorsement: any, index: number) => (
          <NewEndorsements
            key={`endorsement${index}`}
            index={index}
            endorsement={endorsement}
            endorsements={wizard.details.endorsements}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </Grid>
    </TabPanel>
  )
}
