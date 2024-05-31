import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

interface ResponseLoadingType {
  logo: string
}

export default function ResponseLoading(props: ResponseLoadingType) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mb: undefined
      }}
    >
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{
          width: 32,
          height: 32,
          ml: undefined,
          mr: 3,
          fontSize: theme => theme.typography.body1.fontSize
        }}
        src={props.logo}
        alt={'Safha logo'}
      />

      <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
        <Box sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
          <Typography
            sx={{
              boxShadow: 1,
              borderRadius: 1,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(2.25, 4),
              paddingBottom: 0,
              ml: undefined,
              borderTopLeftRadius: 0,
              borderTopRightRadius: undefined,
              color: 'text.primary',
              backgroundColor: 'background.paper'
            }}
          >
            <Icon icon='eos-icons:three-dots-loading' fontSize={16} />
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
              {new Date(Date.now()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
