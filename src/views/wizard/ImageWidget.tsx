import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import { CustomRadioIconsData, CustomRadioIconsProps } from 'src/@core/components/custom-radio/types'
import SingleMediaUploader from 'src/@core/components/media-uploader/single'
import SingleLibraryMediaUploader from 'src/@core/components/media-uploader/single-library'
import { isUrl } from 'src/@core/utils'
import AIGeneratedImages from 'src/views/wizard/AIGeneratedImages'

interface IconType {
  icon: CustomRadioIconsProps['icon']
  iconProps: CustomRadioIconsProps['iconProps']
}

export interface FileProp {
  name: string
  type: string
  size: number
}

interface ImageWidgetProps {
  index: number
  title: string
  entity: any
  entities: Array<any>
  onChange: (team: Array<any>) => Promise<void>
  onImageChange: (image: any, index: number) => void
  onUpload: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onClear: (index: number) => void
  onOpenImagesLibrary: (index: number) => void
  onOptionChange: (prop: string | ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => Promise<any>
}

const ImageWidget = (props: ImageWidgetProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const imageOptionsIcons: CustomRadioIconsData[] = [
    {
      isSelected: true,
      value: 'generate',
      title: (
        <Typography variant='caption' sx={{ mb: 1 }}>
          {t('generate_with_ai')}
        </Typography>
      ),
      content: null
    },
    {
      value: 'upload',
      title: (
        <Typography variant='caption' sx={{ mb: 1 }}>
          {t('upload_from_device')}
        </Typography>
      ),
      content: null
    },
    {
      value: 'library',
      title: (
        <Typography variant='caption' sx={{ mb: 1 }}>
          {t('choose_from_images_library')}
        </Typography>
      ),
      content: null
    }
  ]

  const imageOptions: IconType[] = [
    {
      icon: 'tabler:bookmark-ai',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'tabler:cloud-upload',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    },
    {
      icon: 'tabler:select-all',
      iconProps: { fontSize: '2.125rem', style: { marginBottom: 8 }, color: theme.palette.text.secondary }
    }
  ]

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1
      }}
    >
      <Box display='flex' alignItems='center' gap={1} mb={2}>
        <Typography sx={{ fontSize: '0.8125rem', lineHeight: '1.154' }}>{props.title}</Typography>
      </Box>

      {props.entity.imageType === 'generate' ? (
        <AIGeneratedImages
          index={props.index}
          entity={props.entity}
          entities={props.entities}
          onChange={props.onChange}
          onImageChange={props.onImageChange}
          onUpload={props.onUpload}
          onDelete={props.onDelete}
          onClear={props.onClear}
          onGenerate={props.onGenerate}
        />
      ) : props.entity.imageType === 'upload' ? (
        <Box>
          <SingleMediaUploader
            file={props.entity.image}
            isUploaded={isUrl(props.entity.image)}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif']
            }}
            uploading={props.entity.uploading}
            deleting={props.entity.deleting}
            disabled={false}
            onFileChange={(file: any) => props.onImageChange(file, props.index)}
            onUpload={async () => props.onUpload(props.index)}
            onDelete={async () => props.onDelete(props.index)}
            onClear={() => props.onClear(props.index)}
          />
        </Box>
      ) : props.entity.imageType === 'library' ? (
        <Box>
          <SingleLibraryMediaUploader
            index={props.index}
            file={props.entity.image}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.gif']
            }}
            uploading={props.entity.uploading}
            deleting={props.entity.deleting}
            disabled={false}
            onOpenImagesLibrary={props.onOpenImagesLibrary}
            onUpload={async () => props.onUpload(props.index)}
            onDelete={async () => props.onDelete(props.index)}
            onClear={() => props.onClear(props.index)}
          />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {imageOptionsIcons.map((_, index) => (
            <CustomRadioIcons
              key={index}
              data={imageOptionsIcons[index]}
              icon={imageOptions[index].icon}
              selected={props.entity.imageType}
              name='custom-radios-types'
              gridProps={{ xs: 4 }}
              iconProps={imageOptions[index].iconProps}
              handleChange={props.onOptionChange}
            />
          ))}
        </Grid>
      )}

      {props.entity.imageType && (
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 2,
            marginTop: 3
          }}
        >
          <LoadingButton
            variant='outlined'
            color='secondary'
            disabled={props.entity.generating || props.entity.uploading || props.entity.deleting}
            onClick={() => props.onClear(props.index)}
          >
            {t('clear')}
          </LoadingButton>
        </Grid>
      )}
    </Box>
  )
}

export default ImageWidget
