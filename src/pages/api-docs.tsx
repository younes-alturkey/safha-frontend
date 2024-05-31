import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next/types'
import { getApiDocs } from 'src/lib/swagger'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

interface ApiDocProps {
  spec: object
}

export default function ApiDoc(props: ApiDocProps) {
  return <SwaggerUI spec={props.spec} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const spec = await getApiDocs()

  return {
    props: {
      spec
    }
  }
}
