import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { ReactElement, Ref, forwardRef } from 'react'
import 'react-credit-cards/es/styles-compiled.css'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppDispatch } from 'src/store'
import { setWizardState, wizardInitialState } from 'src/store/apps/wizard'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ResetWizardDialog = () => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onClose = () => dispatch(setWizardState({ ...wizard, showResetDialog: false }))

  const onStartOver = () => dispatch(setWizardState(wizardInitialState))

  return (
    <Dialog
      fullWidth
      open={wizard.showResetDialog}
      maxWidth='sm'
      scroll='body'
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={onClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            {t('saved_progress')}
          </Typography>
          <Typography variant='h6' sx={{ color: 'text.secondary' }}>
            {t('would_you_like_to_continue_or_start_over?')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Button variant='contained' sx={{ mr: 1 }} onClick={onClose}>
          {t('continue')}
        </Button>
        <Button variant='tonal' color='secondary' onClick={onStartOver}>
          {t('start_over')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ResetWizardDialog
