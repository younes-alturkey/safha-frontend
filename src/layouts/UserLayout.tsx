import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ReactNode } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import Layout from 'src/@core/layouts/Layout'
import { HorizontalNavItemsType, VerticalNavItemsType } from 'src/@core/layouts/types'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import VerticalAppBarContent from './components/vertical/AppBarContent'

interface Props {
  children: ReactNode
  contentHeightFixed: boolean
  navigation: {
    UserVerticalNavItems: VerticalNavItemsType
    UserHorizontalNavItems: HorizontalNavItemsType
  }
  user: any
}

const UserLayout = (props: Props) => {
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const user = props.user

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={props.contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: props.navigation.UserVerticalNavItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
              user={user}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: props.navigation.UserHorizontalNavItems
          },
          appBar: {
            content: () => (
              <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} user={user} />
            )
          }
        }
      })}
    >
      {props.children}
    </Layout>
  )
}

export default UserLayout
