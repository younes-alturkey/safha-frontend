import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Icon from 'src/@core/components/icon'
import { Settings } from 'src/@core/context/settingsContext'
import { useSettings } from 'src/@core/hooks/useSettings'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const ColorBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: 45,
  height: 45,
  cursor: 'pointer',
  margin: theme.spacing(2.5, 1.75, 1.75),
  borderRadius: theme.shape.borderRadius,
  transition: 'margin .25s ease-in-out, width .25s ease-in-out, height .25s ease-in-out, box-shadow .25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}))

const Customizer = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { settings, saveSettings } = useSettings()
  const { t } = useTranslation()
  const {
    mode,
    skin,
    appBar,
    footer,
    layout,
    navHidden,
    direction,
    appBarBlur,
    themeColor,
    navCollapsed,
    contentWidth,
    verticalNavToggleType
  } = settings

  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='tabler:settings' />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {t('theme_customizer')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('customize_and_view_in_real_time')}</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              {t('theming')}
            </Typography>

            {/* Skin */}
            <Box sx={{ mb: 5 }}>
              <Typography>{t('skin')}</Typography>
              <RadioGroup
                row
                value={skin}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('skin', e.target.value as Settings['skin'])}
              >
                <FormControlLabel value='default' label={t('default')} control={<Radio />} />
                <FormControlLabel value='bordered' label={t('bordered')} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Mode */}
            <Box sx={{ mb: 5 }}>
              <Typography>{t('mode')}</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label={t('light')} control={<Radio />} />
                <FormControlLabel value='dark' label={t('dark')} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Color Picker */}
            <div>
              <Typography>{t('primary_color')}</Typography>
              <Box sx={{ display: 'flex' }}>
                <ColorBox
                  onClick={() => handleChange('themeColor', 'primary')}
                  sx={{
                    backgroundColor: '#50F5AC',
                    ...(themeColor === 'primary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'secondary')}
                  sx={{
                    backgroundColor: 'secondary.main',
                    ...(themeColor === 'secondary'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'success')}
                  sx={{
                    backgroundColor: 'success.main',
                    ...(themeColor === 'success'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'error')}
                  sx={{
                    backgroundColor: 'error.main',
                    ...(themeColor === 'error'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'warning')}
                  sx={{
                    backgroundColor: 'warning.main',
                    ...(themeColor === 'warning'
                      ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) }
                      : {})
                  }}
                />
                <ColorBox
                  onClick={() => handleChange('themeColor', 'info')}
                  sx={{
                    backgroundColor: 'info.main',
                    ...(themeColor === 'info' ? { width: 53, height: 53, m: theme => theme.spacing(1.5, 0.75, 0) } : {})
                  }}
                />
              </Box>
            </div>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              {t('layout')}
            </Typography>

            {/* Content Width */}
            <Box sx={{ mb: 5 }}>
              <Typography>{t('content_width')}</Typography>
              <RadioGroup
                row
                value={contentWidth}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
              >
                <FormControlLabel value='full' label={t('full')} control={<Radio />} />
                <FormControlLabel value='boxed' label={t('boxed')} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar */}
            <Box sx={{ mb: 5 }}>
              <Typography>{t('appbar_type')}</Typography>
              <RadioGroup
                row
                value={appBar}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('appBar', e.target.value as Settings['appBar'])}
              >
                <FormControlLabel value='fixed' label={t('fixed')} control={<Radio />} />
                <FormControlLabel value='static' label={t('static')} control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='hidden' label={t('hidden')} control={<Radio />} />
                )}
              </RadioGroup>
            </Box>

            {/* Footer */}
            <Box sx={{ mb: 5 }}>
              <Typography>{t('footer_type')}</Typography>
              <RadioGroup
                row
                value={footer}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => handleChange('footer', e.target.value as Settings['footer'])}
              >
                <FormControlLabel value='fixed' label={t('fixed')} control={<Radio />} />
                <FormControlLabel value='static' label={t('static')} control={<Radio />} />
                <FormControlLabel value='hidden' label={t('hidden')} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* AppBar Blur */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{t('appBar_blur')}</Typography>
              <Switch
                name='appBarBlur'
                checked={appBarBlur}
                onChange={e => handleChange('appBarBlur', e.target.checked)}
              />
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              {t('menu')}
            </Typography>

            {/* Menu Layout */}
            <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 5 }}>
              <Typography>{t('menu_layout')}</Typography>
              <RadioGroup
                row
                value={layout}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value as Settings['layout'],
                    lastLayout: e.target.value as Settings['lastLayout']
                  })
                }}
              >
                <FormControlLabel value='vertical' label={t('vertical')} control={<Radio />} />
                <FormControlLabel value='horizontal' label={t('horizontal')} control={<Radio />} />
              </RadioGroup>
            </Box>

            {/* Menu Toggle */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ mb: 5 }}>
                <Typography>{t('menu_toggle')}</Typography>
                <RadioGroup
                  row
                  value={verticalNavToggleType}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.secondary' } }}
                  onChange={e =>
                    handleChange('verticalNavToggleType', e.target.value as Settings['verticalNavToggleType'])
                  }
                >
                  <FormControlLabel value='accordion' label={t('accordion')} control={<Radio />} />
                  <FormControlLabel value='collapse' label={t('collapse')} control={<Radio />} />
                </RadioGroup>
              </Box>
            )}

            {/* Menu Collapsed */}
            {navHidden || layout === 'horizontal' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                <Typography>{t('menu_collapsed')}</Typography>
                <Switch
                  name='navCollapsed'
                  checked={navCollapsed}
                  onChange={e => handleChange('navCollapsed', e.target.checked)}
                />
              </Box>
            )}

            {/* Menu Hidden */}
            {layout === 'horizontal' && appBar === 'hidden' ? null : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>{t('menu_hidden')}</Typography>
                <Switch
                  name='navHidden'
                  checked={navHidden}
                  onChange={e => handleChange('navHidden', e.target.checked)}
                />
              </Box>
            )}
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 5, color: 'text.disabled', textTransform: 'uppercase' }}
            >
              {t('misc')}
            </Typography>

            {/* RTL */}
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{t('rtl')}</Typography>
              <Switch
                name='direction'
                checked={direction === 'rtl'}
                onChange={e => handleChange('direction', e.target.checked ? 'rtl' : 'ltr')}
              />
            </Box>
          </CustomizerSpacing>
        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer
