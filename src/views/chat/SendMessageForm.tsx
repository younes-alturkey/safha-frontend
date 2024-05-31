import { faker } from '@faker-js/faker'
import LoadingButton from '@mui/lab/LoadingButton'
import Box, { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import * as Sentry from '@sentry/nextjs'
import { Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getUniqueId, handleCreateEvent } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import {
  createNewThread,
  generateWebsite,
  messageAssistant,
  setLocked,
  setMessages,
  setPlayFireworks,
  setPrompt,
  setShowSettings
} from 'src/store/apps/chat'
import { Events } from 'src/types/enums'

const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const FormContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

interface SendMessageFormProps {
  apiUrl: string
}

const SendMessageForm = (props: SendMessageFormProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { thread, prompt, loading, generating, locked, messages } = useSelector((state: any) => state.chat)
  const { data: session } = useSession()
  const { t } = useTranslation()
  const theme = useTheme()
  const intervalRef = useRef<any>(null)
  const [int, setInt] = useState('')

  const handleOpenSettings = () => dispatch(setShowSettings(true))

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

  const onSubmit = async () => {
    try {
      dispatch(setPrompt(''))

      let tead = thread
      let email = getUniqueId()
      const user = session?.user
      if (user && user.email) email = user.email

      if (!tead) {
        const threadOp = await dispatch(createNewThread())
        if (threadOp.meta.requestStatus === 'fulfilled') tead = threadOp.payload
        else throw new Error(threadOp.payload as string)
      }

      const payload = {
        thread: tead,
        msg: prompt
      }

      dispatch(
        setMessages([
          ...messages,
          {
            id: `msg_${faker.string.uuid()}`,
            created_at: Math.floor(Date.now() / 1000),
            role: 'user',
            content: [
              {
                type: 'text',
                text: {
                  value: prompt,
                  annotations: []
                }
              }
            ]
          }
        ])
      )
      const messageAssistantOp = await dispatch(messageAssistant(payload))
      if (messageAssistantOp.meta.requestStatus === 'fulfilled') {
        handleCreateEvent(Events.SUBMITTED_PROMPT, email, [`user_email: ${email}`, `user_prompt: ${prompt}`])

        const payload = messageAssistantOp.payload as any
        const isReady = payload.isReady
        if (isReady && !generating) {
          const websiteInfo = payload.websiteInfo
          const pload = {
            apiUrl: props.apiUrl,
            thread: tead,
            info: websiteInfo,
            type: 'landingpage'
          }

          toast.success(t('generating_website'), {
            duration: 9000
          })
          startCountdown(5 * 60)
          const websiteGenerationOp = await dispatch(generateWebsite(pload))
          if (websiteGenerationOp.meta.requestStatus === 'fulfilled') {
            handleClearInterval()
            setInt('')
            dispatch(setLocked(true))

            toast.success(t('your_website_is_live'), {
              duration: 9000
            })

            dispatch(setPlayFireworks(true))
          } else throw new Error(websiteGenerationOp.payload as string)
        }
      } else throw new Error(messageAssistantOp.payload as string)
    } catch (err) {
      console.error(err)
      toast.error(t('something_went_wrong'))
      Sentry.captureException(err)
    }
  }

  useEffect(() => {
    return () => {
      handleClearInterval()
    }
  }, [])

  return (
    <Formik initialValues={{ prompt: '' }} onSubmit={onSubmit}>
      <Form className='w-full' autoComplete='off'>
        <FormContainer>
          <ChatFormWrapper>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', height: 36.5, width: '100%' }}>
              <PerfectScrollbar style={{ width: '100%' }} options={{ wheelPropagation: false }}>
                <CustomTextField
                  fullWidth
                  placeholder={`${t('message_safha_gpt')}`}
                  id='prompt-input'
                  data-testid='prompt-input'
                  disabled={loading || locked}
                  value={prompt}
                  onChange={e => dispatch(setPrompt(e.target.value))}
                  sx={{
                    '& .Mui-focused': { boxShadow: 'none !important' },
                    '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                      p: theme => theme.spacing(1.875, 2.5)
                    },
                    '& .MuiInputBase-root': {
                      border: '0 !important'
                    },
                    '& .MuiInputBase-root.Mui-disabled': {
                      backgroundColor: `${theme.palette.background.paper} !important`
                    }
                  }}
                />
              </PerfectScrollbar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{int}</Typography>

              <IconButton disabled={loading || locked} onClick={handleOpenSettings} sx={{ color: 'text.disabled' }}>
                <Icon icon='material-symbols:expand-content-rounded' />
              </IconButton>

              <LoadingButton
                id='submit-button'
                data-testid='submit-button'
                type='submit'
                variant='contained'
                disabled={!prompt || locked}
                loading={loading}
              >
                {t('send')}
              </LoadingButton>
            </Box>
          </ChatFormWrapper>
        </FormContainer>
      </Form>
    </Formik>
  )
}

export default SendMessageForm
