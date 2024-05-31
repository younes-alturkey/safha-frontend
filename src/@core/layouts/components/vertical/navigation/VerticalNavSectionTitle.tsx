// ** MUI Imports
import MuiListSubheader, { ListSubheaderProps } from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { Settings } from 'src/@core/context/settingsContext'
import { NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Components Imports
import Translations from 'src/layouts/components/Translations'

interface Props {
  navHover: boolean
  settings: Settings
  item: NavSectionTitle
  collapsedNavWidth: number
  navigationBorderWidth: number
}

// ** Styled Components
const ListSubheader = styled((props: ListSubheaderProps) => <MuiListSubheader component='li' {...props} />)(
  ({ theme }) => ({
    lineHeight: 1,
    display: 'flex',
    position: 'static',
    marginTop: theme.spacing(3.5),
    paddingTop: theme.spacing(1.5),
    backgroundColor: 'transparent',
    paddingBottom: theme.spacing(1.5),
    transition: 'padding-left .25s ease-in-out'
  })
)

const VerticalNavSectionTitle = (props: Props) => {
  // ** Props
  const { item, navHover, settings, collapsedNavWidth, navigationBorderWidth } = props

  // ** Vars
  const { navCollapsed } = settings

  return (
    <ListSubheader
      className='nav-section-title'
      sx={{
        ...(navCollapsed && !navHover
          ? { py: 0.5, px: (collapsedNavWidth - navigationBorderWidth - 22) / 8 }
          : { px: 7.5 }),
        '& .MuiTypography-root, & svg': {
          color: 'text.disabled'
        }
      }}
    >
      {navCollapsed && !navHover ? (
        <Icon icon='tabler:separator' />
      ) : (
        <Typography noWrap variant='caption' sx={{ textTransform: 'uppercase' }}>
          <Translations text={item.sectionTitle} />
        </Typography>
      )}
    </ListSubheader>
  )
}

export default VerticalNavSectionTitle
