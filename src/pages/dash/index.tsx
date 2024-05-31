import { faker } from '@faker-js/faker'
import { Grid } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import { useTranslation } from 'react-i18next'
import { HorizontalNavItemsType, VerticalNavItemsType } from 'src/@core/layouts/types'
import { getWebsites } from 'src/api/website'
import UserLayout from 'src/layouts/UserLayout'
import UserHorizontalNavItems from 'src/navigation/user/horizontal'
import UserVerticalNavItems from 'src/navigation/user/vertical'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'
import { bucketUrl } from 'src/types/constants'
import { HTTP } from 'src/types/enums'

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
  const illustration = `${bucketUrl}/under-work-illustration.png`
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
  const apiUrl = process.env.API_URL as string
  const navigation = {
    UserVerticalNavItems,
    UserHorizontalNavItems
  }

  let session = null
  let websites: any[] = [
    { name: faker.person.fullName(), url: 'https://golden.safha.com' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-10-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-2-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-4-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-5-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-6-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-7-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-8-safha.vercel.app' },
    { name: faker.person.fullName(), url: 'https://safha-prompt-poc-git-safha-web-9-safha.vercel.app' }
  ]

  try {
    const sessionData = await getServerSession(context.req, context.res, authOptions)
    session = JSON.stringify(sessionData)

    const websitesRes = await getWebsites(apiUrl)
    if ('status' in websitesRes && websitesRes.status === HTTP.OK)
      websites = [
        ...websitesRes.data.map((w: any) => ({
          name: w.resouceName,
          url: `https://${w.resouceName}.safha.com`
        })),
        ...websites
      ]
  } catch (err) {
    console.error(err)
    Sentry.captureException(err)
  }

  return {
    props: { apiUrl, navigation, session, websites }
  }
}

export default DashPage
