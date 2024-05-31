import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { ColorButton, ColorPicker } from 'mui-color'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { colors as clrs, getArrRandomElements } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { setWizardState } from 'src/store/apps/wizard'

export default function WizardColorPicker() {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()
  const [colors, setColors] = useState(getArrRandomElements(clrs, 8))

  const updateColors = () => setColors(getArrRandomElements(clrs, 8))

  const setColor = async (color: any) => {
    if (wizard.details.brand.primaryColor === color)
      dispatch(
        setWizardState({
          ...wizard,
          details: { ...wizard.details, brand: { ...wizard.details.brand, primaryColor: '' } }
        })
      )
    else
      dispatch(
        setWizardState({
          ...wizard,
          details: { ...wizard.details, brand: { ...wizard.details.brand, primaryColor: color } }
        })
      )
  }

  return (
    <Box>
      <Box display='flex' alignItems='center' gap={1}>
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{t('primary_color')}</Typography>
        <IconButton
          color='secondary'
          id='refresh-colors-button'
          data-testid='refresh-colors-button'
          onClick={updateColors}
          onMouseDown={e => {
            e.preventDefault()
          }}
          aria-label='refresh colors button'
        >
          <Icon fontSize='1rem' icon='material-symbols:refresh' />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {colors.map((color, index) => (
            <Box sx={{ position: 'relative' }} key={color + index} onClick={() => setColor(color)}>
              <ColorButton color={color} />
            </Box>
          ))}
        </Box>

        <Box height='100%' display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='body2' sx={{ opacity: 0.5 }}>
            {t('or')}
          </Typography>
        </Box>

        <Box margin={-1.5}>
          <ColorPicker
            value={wizard.details.brand.primaryColor}
            onChange={(color: any) => setColor(`#${color.hex}`)}
            defaultValue='#50F5AC'
            disableTextfield
            hideTextfield
          />
        </Box>
      </Box>
    </Box>
  )
}
