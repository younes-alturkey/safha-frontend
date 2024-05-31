import Grid from '@mui/material/Grid'
import WizardDetails from 'src/@core/components/wizard-details'
import { WizardDetailsType } from 'src/@core/components/wizard-details/types'

interface Props {
  options: WizardDetailsType[] | null
}

const WebsiteWizards = (props: Props) => {
  const { options } = props

  return (
    <Grid container spacing={6}>
      {options?.map((item: WizardDetailsType) => (
        <Grid item xs={12} md={6} key={item.title.toLowerCase()}>
          <WizardDetails data={item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default WebsiteWizards
