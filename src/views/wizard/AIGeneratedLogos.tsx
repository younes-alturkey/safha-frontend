import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { isArrayEmpty } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { logosGenerate, setWizardState } from 'src/store/apps/wizard'

export interface FileProp {
  name: string
  type: string
  size: number
}

interface AIGeneratedLogosProps {
  title: string
  file: FileProp | null
  setFile: (file: FileProp | null) => void
}

const AIGeneratedLogos = (props: AIGeneratedLogosProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const intervalRef = useRef<any>(null)
  const [int, setInt] = useState('')

  const clearPrompt = () =>
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          brand: { ...wizard.details.brand, prompt: '' }
        }
      })
    )

  function handleClearInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  function startCountdown(duration: number) {
    let timer = duration,
      minutes,
      seconds
    intervalRef.current = setInterval(function () {
      minutes = Math.floor(timer / 60)
      seconds = timer % 60

      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      setInt(minutes + ':' + seconds)

      if (--timer < 0) handleClearInterval()
    }, 1000)
  }

  const handleGenerateLogos = async () => {
    try {
      startCountdown(60)
      const generateOp = await dispatch(logosGenerate({ prompt: wizard.details.brand.prompt }))
      handleClearInterval()
      setInt('')
      if (generateOp.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to generate logos')
      }
    } catch (error) {
      console.error(error)
      toast.error(t('something_went_wrong'))
    }
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{props.title}</Typography>
      </Box>

      {!isArrayEmpty(wizard.details.brand.aiLogos) ? (
        <Grid container spacing={2}>
          {wizard.details.brand.aiLogos.map((logo: string) => (
            <Grid key={logo} item xs={12} md={4} lg={3}>
              <Box
                onClick={() =>
                  dispatch(
                    setWizardState({
                      ...wizard,
                      details: {
                        ...wizard.details,
                        brand: {
                          ...wizard.details.brand,
                          aiLogo: logo
                        }
                      }
                    })
                  )
                }
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  borderStyle: 'solid',
                  borderWidth: 2,
                  p: 1,
                  borderRadius: 1,
                  borderColor:
                    wizard.details.brand.aiLogo === logo
                      ? theme.palette.primary.main
                      : isDark
                      ? theme.palette.grey[700]
                      : theme.palette.grey[300],
                  cursor: 'pointer',
                  ':hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <img
                  alt='AI Generated Logo'
                  style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                  src={logo}
                />
                {wizard.details.brand.aiLogo === logo && (
                  <Icon
                    style={{
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      top: 4,
                      ...(isAr ? { left: 4 } : { right: 4 })
                    }}
                    fontSize='1.3rem'
                    icon='ph:seal-check-fill'
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' gap={1}>
          <TextField
            sx={{
              width: 296
            }}
            minRows={6}
            multiline
            fullWidth
            value={wizard.details.brand.prompt}
            disabled={wizard.details.brand.generating}
            onChange={e =>
              dispatch(
                setWizardState({
                  ...wizard,
                  details: {
                    ...wizard.details,
                    brand: { ...wizard.details.brand, prompt: e.target.value }
                  }
                })
              )
            }
            placeholder={`${t('generate_logo_prompt_example')}`}
          />
          <Box
            sx={{ width: '100%', position: 'relative' }}
            display='flex'
            justifyContent='flex-start'
            alignItems='center'
            gap={2}
            marginTop={2}
          >
            <LoadingButton
              id='generate-button'
              data-testid='generate-button'
              variant='contained'
              color='primary'
              fullWidth
              disabled={!wizard.details.brand.prompt}
              loading={wizard.details.brand.generating}
              onClick={handleGenerateLogos}
            >
              {t('generate')}
            </LoadingButton>
            <Button
              fullWidth
              onClick={clearPrompt}
              disabled={!wizard.details.brand.prompt || wizard.details.brand.generating}
              variant='outlined'
              color='secondary'
            >
              {t('clear')}
            </Button>
            {int && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '110%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Typography>{int}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AIGeneratedLogos
