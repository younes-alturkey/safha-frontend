import { getServerSession } from 'next-auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { HorizontalNavItemsType, VerticalNavItemsType } from 'src/@core/layouts/types'
import UserLayout from 'src/layouts/UserLayout'
import UserHorizontalNavItems from 'src/navigation/user/horizontal'
import UserVerticalNavItems from 'src/navigation/user/vertical'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import UserProfile from 'src/views/pages/user-profile/UserProfile'

interface Props {
  tab: string
  navigation: {
    UserVerticalNavItems: VerticalNavItemsType
    UserHorizontalNavItems: HorizontalNavItemsType
  }
  session: string
}

const UserProfileTab = (props: Props) => {
  const session = JSON.parse(props.session)
  const user = session.user

  return (
    <UserLayout contentHeightFixed={false} user={user} navigation={props.navigation}>
      <UserProfile {...props} user={user} />
    </UserLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const navigation = {
    UserVerticalNavItems,
    UserHorizontalNavItems
  }

  const sessionStr = await getServerSession(context.req, context.res, authOptions)
  const session = JSON.stringify(sessionStr)

  return {
    props: { session, navigation, tab: 'profile' }
  }
}

export default UserProfileTab
