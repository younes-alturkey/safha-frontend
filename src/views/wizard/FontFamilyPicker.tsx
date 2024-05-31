import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
  Almarai,
  Amiri,
  Cairo,
  Changa,
  El_Messiri,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Arabic,
  Rubik,
  Tajawal
} from 'next/font/google'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import { CustomRadioIconsData } from 'src/@core/components/custom-radio/types'
import CustomChip from 'src/@core/components/mui/chip'

const rubik = Rubik({ subsets: ['arabic', 'latin'], weight: '400' })
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: '400' })
const tajawal = Tajawal({ subsets: ['arabic', 'latin'], weight: '400' })
const almarai = Almarai({ subsets: ['arabic'], weight: '400' })
const ibm_plex_sans_arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: '400' })
const ibm_plex_mono = IBM_Plex_Mono({ subsets: ['latin'], weight: '400' })
const amiri = Amiri({ subsets: ['arabic', 'latin'], weight: '400' })
const changa = Changa({ subsets: ['arabic', 'latin'], weight: '400' })
const el_messiri = El_Messiri({ subsets: ['arabic', 'latin'], weight: '400' })

interface FontFamilyPickerProps {
  title: string
  fontFamily: string
  setFontFamily: (fontFamily: string) => void
}

export default function FontFamilyPicker(props: FontFamilyPickerProps) {
  const { t } = useTranslation()

  const fonts: CustomRadioIconsData[] = [
    {
      isSelected: false,
      value: 'rubik',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }} className={rubik.className}>
          {t('rubik')}
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'cairo',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }} className={cairo.className}>
          {t('cairo')}
        </Typography>
      ),
      content: (
        <>
          <CustomChip
            rounded
            size='small'
            skin='light'
            label={t('popular')}
            color='primary'
            sx={{ top: 12, right: 12, position: 'absolute' }}
          />
        </>
      )
    },
    {
      isSelected: false,
      value: 'tajawal',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={tajawal.className}>{t('tajawal')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'almarai',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={almarai.className}>{t('almarai')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'ibm_plex_sans_arabic',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={ibm_plex_sans_arabic.className}>{t('ibm_plex_sans_arabic')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'ibm_plex_mono',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={ibm_plex_mono.className}>{t('ibm_plex_mono')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'amiri',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }} className={amiri.className}>
          <span className={amiri.className}>{t('amiri')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'el_messiri',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={el_messiri.className}>{t('el_messiri')}</span>
        </Typography>
      ),
      content: null
    },
    {
      isSelected: false,
      value: 'changa',
      title: (
        <Typography variant='h6' sx={{ mb: 1 }}>
          <span className={changa.className}>{t('changa')}</span>
        </Typography>
      ),
      content: null
    }
  ]

  const handleIconRadioChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    if (props.fontFamily === value) props.setFontFamily('')
    else props.setFontFamily(value)
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154', marginBottom: '0.75rem' }}>
        {props.title}
      </Typography>
      <Box display='flex' alignItems='center' gap={1}>
        <Grid container spacing={4}>
          {fonts.map((_, index) => (
            <CustomRadioIcons
              key={index}
              data={fonts[index]}
              selected={props.fontFamily}
              name='custom-radios-font'
              gridProps={{ sm: 4, xs: 12 }}
              handleChange={handleIconRadioChange}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
