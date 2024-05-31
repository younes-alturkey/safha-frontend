import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ReactNode } from 'react'
import { bucketUrl } from 'src/types/constants'

interface FooterIllustrationsProp {
  image?: ReactNode
}

// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  height: 260,
  width: '100%',
  position: 'absolute'
}))

const FooterIllustrations = (props: FooterIllustrationsProp) => {
  const { image } = props
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const mask = bucketUrl
    ? `${bucketUrl}/misc-mask-${theme.palette.mode}.png`
    : `/images/pages/misc-mask-${theme.palette.mode}.png`

  if (!hidden) {
    return (
      <>
        {!image ? (
          <MaskImg alt='mask' src={mask} />
        ) : typeof image === 'string' ? (
          <MaskImg alt='mask' src={image} />
        ) : (
          image
        )}
      </>
    )
  } else {
    return null
  }
}

export default FooterIllustrations
