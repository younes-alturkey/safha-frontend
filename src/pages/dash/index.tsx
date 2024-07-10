import { Grid } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { getServerSession } from 'next-auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useTranslation } from 'react-i18next'
import { HorizontalNavItemsType, VerticalNavItemsType } from 'src/@core/layouts/types'
import UserLayout from 'src/layouts/UserLayout'
import UserHorizontalNavItems from 'src/navigation/user/horizontal'
import UserVerticalNavItems from 'src/navigation/user/vertical'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

interface Props {
  navigation: {
    UserVerticalNavItems: VerticalNavItemsType
    UserHorizontalNavItems: HorizontalNavItemsType
  }
  session: string
  websites: any[]
}

const DashPage = (props: Props) => {
  const session = JSON.parse(props.session)
  const user = session.user
  const illustration = `/ohh.png`
  const { t } = useTranslation()

  return (
    <UserLayout contentHeightFixed={false} user={user} {...props}>
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          <BoxWrapper>
            <Typography variant='h2' sx={{ mb: 4 }}>
              {t('oops_feature_coming_soon')}
            </Typography>
          </BoxWrapper>
          <Img height='500' alt='error-illustration' src={illustration} />
        </Grid>
      </Grid>
    </UserLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const navigation = {
    UserVerticalNavItems,
    UserHorizontalNavItems
  }

  let session = null

  try {
    const sessionData = await getServerSession(context.req, context.res, authOptions)
    if (!sessionData) return { redirect: { destination: '/signin', permanent: false } }
    session = JSON.stringify(sessionData)
  } catch (err) {
    console.error(err)
  }

  return {
    props: { navigation, session }
  }
}

export default DashPage
