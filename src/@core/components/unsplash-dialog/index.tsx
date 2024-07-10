import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, ReactElement, Ref, forwardRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { numArray, sleep } from 'src/@core/utils'
import { downloadImage } from 'src/api/download'
import { unsplashSearch } from 'src/api/unsplash'
import { HTTP } from 'src/types/enums'

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  height: 390,
  marginTop: 14
})

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

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

interface UnsplashDialogProps {
  images: Array<any>
  show: boolean
  onShow: (show: boolean) => void
  onSelect: (image: string) => void
  setImages: (images: Array<any>) => void
}

export default function UnsplashDialog(props: UnsplashDialogProps) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [downloading, setDownloading] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [isContain, setIsContain] = useState<string | null>(null)

  const toggleIsContain = (id: string) => {
    setIsContain(isContain === id ? null : id)
  }

  const onDownload = async (imageUrl: string, imageName: string, imageExtension: string) => {
    try {
      setDownloading(imageUrl)
      const imageRes = await downloadImage({ imageUrl, imageName, imageExtension })
      if (imageRes.status === HTTP.OK) {
        const buffer = imageRes.data
        const blob = new Blob([buffer], { type: `image/${imageExtension}` })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = imageName
        document.body.appendChild(a)
        a.click()
        setDownloading(null)
        await sleep(100)
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Failed to download image')
      }
    } catch (err) {
      console.error(err)
      toast.error(t('something_went_wrong'))
    }
  }

  const onSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const searchReq = await unsplashSearch({ query, perPage: 28 })
      if (searchReq.status === HTTP.OK) {
        const results = searchReq.data.response.results
        props.setImages(results)
        setQuery('')
      } else {
        throw new Error('Failed to search Unsplash images')
      }
    } catch (err) {
      console.error(err)
      toast.error(t('something_went_wrong'))
    }
    setLoading(false)
  }

  return (
    <Dialog
      fullWidth
      open={props.show}
      onClose={() => props.onShow(false)}
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <CustomCloseButton onClick={() => props.onShow(false)}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' sx={{ mb: 3 }}>
            {t('images_library')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('millions_of_images_at_your_fingertips')}</Typography>
        </Box>
        <form onSubmit={onSearch} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <CustomTextField
            fullWidth
            value={query}
            disabled={loading}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search_for_an_image') as string}
          />
          <LoadingButton
            id='search-button'
            data-testid='search-button'
            variant='contained'
            loading={loading}
            disabled={!query}
            type='submit'
          >
            {t('search')}
          </LoadingButton>
        </form>
        <PerfectScrollbar>
          <Grid container spacing={2} height='100%'>
            {loading ? (
              numArray(28).map(number => {
                return (
                  <Grid key={number} item xs={12} sm={6} md={3} height={144} position='relative'>
                    <Box display='flex' flexDirection='column' width='100%' height='100%'>
                      <Box position='relative' height='100%' width='100%' overflow='hidden' borderRadius={1.5}>
                        <Box
                          className='animate-pulse'
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                      <Box
                        className='animate-pulse'
                        marginTop={1}
                        borderRadius={0.5}
                        style={{
                          width: '75%',
                          height: 14,
                          backgroundColor: 'rgba(0,0,0,0.1)'
                        }}
                      />
                    </Box>
                  </Grid>
                )
              })
            ) : props.images ? (
              props.images.map(image => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={image.id} height={144} position='relative'>
                    <Box display='flex' flexDirection='column' width='100%' height='100%'>
                      <Box
                        onClick={() => props.onSelect(image.urls.full)}
                        position='relative'
                        height='100%'
                        width='100%'
                        overflow='hidden'
                        borderRadius={1.5}
                        sx={{
                          cursor: 'pointer',
                          marginBottom: 1,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0)',
                            transition: 'background-color 0.5s ease',
                            zIndex: 1
                          },
                          '&:hover::before': {
                            backgroundColor: 'rgba(0,0,0,0.5)'
                          },
                          '&:hover img': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.5s ease'
                          }
                        }}
                      >
                        <Image
                          style={{
                            zIndex: 0,
                            transition: 'transform 0.5s ease',
                            objectFit: isContain === image.id ? 'contain' : 'cover',
                            objectPosition: isContain === image.id ? 'center' : 'top'
                          }}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          alt={image.alt_description}
                          src={image.urls.full}
                        />
                      </Box>

                      <Link
                        href={image.user.links.html}
                        target='_blank'
                        style={{
                          textDecoration: 'none',
                          width: 'fit-content'
                        }}
                      >
                        <Typography
                          variant='caption'
                          marginTop={1}
                          style={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {`${t('by')} ${image.user.name}`}
                        </Typography>
                      </Link>

                      <LoadingButton
                        onClick={() => onDownload(image.links.download, image.alt_description, 'jpg')}
                        disabled={Boolean(downloading)}
                        loading={downloading === image.links.download}
                        style={{
                          textDecoration: 'none',
                          zIndex: 3,
                          position: 'absolute',
                          bottom: 26,
                          ...(isAr ? { left: 4 } : { right: 4 })
                        }}
                        color='primary'
                      >
                        <Icon fontSize='0.75rem' icon='bi:download' />
                      </LoadingButton>

                      <LoadingButton
                        onClick={() => toggleIsContain(image.id)}
                        style={{
                          zIndex: 3,
                          position: 'absolute',
                          bottom: 26,
                          ...(isAr ? { right: 12 } : { left: 12 })
                        }}
                        color='primary'
                      >
                        <Icon fontSize='0.75rem' icon='bi:arrows-fullscreen' />
                      </LoadingButton>
                    </Box>
                  </Grid>
                )
              })
            ) : (
              <Grid item xs={12} height='100%'>
                <Box height='100%' display='flex' justifyContent='center' alignItems='center'>
                  <Typography sx={{ mb: 3 }}>{t('search_for_relevant_images')}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </PerfectScrollbar>
      </DialogContent>
    </Dialog>
  )
}
