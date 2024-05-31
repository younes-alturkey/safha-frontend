import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'

const SwitchesColors = () => {
  return (
    <FormGroup row>
      <FormControlLabel control={<Switch defaultChecked />} label='Primary' />
      <FormControlLabel control={<Switch defaultChecked color='secondary' />} label='Secondary' />
      <FormControlLabel control={<Switch defaultChecked color='success' />} label='Success' />
      <FormControlLabel control={<Switch defaultChecked color='error' />} label='Error' />
      <FormControlLabel control={<Switch defaultChecked color='warning' />} label='Warning' />
      <FormControlLabel control={<Switch defaultChecked color='info' />} label='Info' />
    </FormGroup>
  )
}

export default SwitchesColors
