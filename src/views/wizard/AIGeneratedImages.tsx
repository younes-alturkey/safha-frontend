import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { isArrayEmpty } from 'src/@core/utils'

export interface FileProp {
  name: string
  type: string
  size: number
}

interface AIGeneratedImagesProps {
  index: number
  entity: any
  entities: Array<any>
  onChange: (team: Array<any>) => Promise<void>
  onImageChange: (image: any, index: number) => void
  onUpload: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onClear: (index: number) => void
  onGenerate: () => Promise<any>
}

const AIGeneratedImages = (props: AIGeneratedImagesProps) => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const intervalRef = useRef<any>(null)
  const [int, setInt] = useState('')
  const [isContain, setIsContain] = useState<string | null>(null)

  function toggleContain(image: string) {
    setIsContain(isContain === image ? null : image)
  }

  const setPrompt = (prompt: string) => {
    const project = { ...props.entity }
    project.prompt = prompt
    const projects = [...props.entities]
    projects[props.index] = project
    props.onChange(projects)
  }

  const clearPrompt = () => {
    const project = { ...props.entity }
    project.prompt = ''
    const projects = [...props.entities]
    projects[props.index] = project
    props.onChange(projects)
  }

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

  const handleSetImages = (image: string) => {
    const project = { ...props.entity }
    project.image = image
    const projects = [...props.entities]
    projects[props.index] = project
    props.onChange(projects)
  }

  const handleGenerateImages = async () => {
    try {
      startCountdown(60)
      const generateOp = await props.onGenerate()
      handleClearInterval()
      setInt('')
      if (generateOp.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to generate images')
      }
    } catch (error) {
      Sentry.captureException(error)
      console.error(error)
      toast.error(t('something_went_wrong'))
    }
  }

  return (
    <Box>
      {props.entity.aiImages && !isArrayEmpty(props.entity.aiImages) ? (
        <Grid container spacing={2}>
          {props.entity.aiImages.map((image: string) => (
            <Grid key={image} item xs={12} md={4} lg={3}>
              <Box
                onClick={() => handleSetImages(image)}
                sx={{
                  position: 'relative',
                  flex: 1,
                  width: '100%',
                  minWidth: 160,
                  height: '100%',
                  minHeight: 160,
                  overflow: 'hidden',
                  borderStyle: 'solid',
                  borderWidth: 2,
                  p: 1,
                  borderRadius: 1,
                  borderColor:
                    props.entity.image === image
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
                  alt='AI Generated Image'
                  style={{
                    objectFit: isContain === image ? 'contain' : 'cover',
                    objectPosition: isContain === image ? 'center' : 'top',
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                  src={image}
                />
                {props.entity.image === image && (
                  <Icon
                    style={{
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      top: 6,
                      ...(isAr ? { left: 6 } : { right: 6 })
                    }}
                    fontSize='1.3rem'
                    icon='ph:seal-check-fill'
                  />
                )}

                <LoadingButton
                  onClick={() => toggleContain(image)}
                  style={{
                    zIndex: 50,
                    position: 'absolute',
                    bottom: 12,
                    ...(isAr ? { right: 8 } : { left: 8 })
                  }}
                  color='primary'
                >
                  <Icon fontSize='0.75rem' icon='bi:arrows-fullscreen' />
                </LoadingButton>
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
            value={props.entity.prompt}
            disabled={props.entity.generating}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`${t('project_image_prompt_example')}`}
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
              disabled={!props.entity.prompt}
              loading={props.entity.generating}
              onClick={handleGenerateImages}
            >
              {t('generate')}
            </LoadingButton>
            <Button
              fullWidth
              onClick={clearPrompt}
              disabled={!props.entity.prompt || props.entity.generating}
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

export default AIGeneratedImages
