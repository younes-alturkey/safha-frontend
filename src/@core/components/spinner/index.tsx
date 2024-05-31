import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        zIndex: 9999,
        backgroundColor: theme.palette.customColors.bodyBg,
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
