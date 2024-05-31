import Grid from '@mui/material/Grid'
import AboutOverivew from 'src/views/pages/user-profile/uprofile/AboutOverivew'

const ProfileTab = (props: { user: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew user={props.user} />
      </Grid>
    </Grid>
  )
}

export default ProfileTab
