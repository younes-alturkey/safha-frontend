import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import CustomChip from 'src/@core/components/mui/chip'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { WizardDetailsProps } from './types'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(16),
  borderRadius: theme.shape.borderRadius
}))

const WizardDetails = (props: WizardDetailsProps) => {
  const { t } = useTranslation()

  return (
    <BoxWrapper
      sx={{
        border: theme =>
          !props.data?.popularPlan
            ? `1px solid ${theme.palette.divider}`
            : `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
      }}
    >
      {props.data?.popularPlan ? (
        <CustomChip
          rounded
          size='small'
          skin='light'
          label={t('recommended')}
          color='primary'
          sx={{
            top: 24,
            right: 24,
            position: 'absolute',
            '& .MuiChip-label': {
              px: 1.75,
              fontWeight: 500,
              fontSize: '0.75rem'
            }
          }}
        />
      ) : null}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <img
          width={props.data?.imgWidth}
          src={`${props.data?.imgSrc}`}
          height={props.data?.imgHeight}
          alt={props.data?.title}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ mb: 1.5, fontWeight: 500, lineHeight: 1.385, fontSize: '1.625rem' }}>
          {props.data?.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', my: 8 }}>{props.data?.subtitle}</Typography>
      </Box>
      <Link href={props.data.url}>
        <Button fullWidth color={'primary'} variant={props.data?.popularPlan ? 'contained' : 'tonal'}>
          {props.data.urlText}
        </Button>
      </Link>
    </BoxWrapper>
  )
}

export default WizardDetails
