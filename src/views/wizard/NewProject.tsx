import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AppDispatch } from 'src/store'
import { projectImagesGenerate } from 'src/store/apps/wizard'
import ImageWidget from 'src/views/wizard/ImageWidget'

export type Project = {
  title: string
  description: string
  image: string | null
  imageType: 'generate' | 'upload' | 'library' | null
  prompt: string
  aiImages: Array<string> | null
  uploading: boolean
  deleting: boolean
  generating: boolean
}

interface NewProjectProps {
  index: number
  project: Project
  projects: Array<Project>
  onChange: (team: Array<any>) => Promise<void>
  onRemove: (index: number) => Promise<void>
  onImageChange: (image: any, index: number) => void
  onUpload: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onClear: (index: number) => void
  onOpenImagesLibrary: (index: number) => void
}

export default function NewProject(props: NewProjectProps) {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onFieldUpdate = (field: string, value: string) => {
    const project = { ...props.projects[props.index] } as any
    project[field] = value
    const projects = [...props.projects]
    projects[props.index] = project
    props.onChange(projects)
  }

  const onOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    const project = { ...wizard.details.projects[props.index] }
    const currentImageType = project.imageType
    if (value === currentImageType) project.imageType = null
    else project.imageType = value
    const projects = [...wizard.details.projects]
    projects[props.index] = project
    props.onChange(projects)
  }

  return (
    <Grid
      item
      xs={12}
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='flex-start'
      gap={4}
    >
      <ImageWidget
        title={`${t('project_image')} (${t('optional')})`}
        index={props.index}
        entity={props.project}
        entities={props.projects}
        onChange={props.onChange}
        onImageChange={props.onImageChange}
        onUpload={props.onUpload}
        onDelete={props.onDelete}
        onClear={props.onClear}
        onOpenImagesLibrary={props.onOpenImagesLibrary}
        onOptionChange={onOptionChange}
        onGenerate={async () =>
          await dispatch(projectImagesGenerate({ index: props.index, prompt: props.project.prompt }))
        }
      />

      <Box
        sx={{ width: '100%' }}
        display='flex'
        flexDirection='column'
        justifyContent='flex-start'
        alignItems='flex-start'
        gap={4}
      >
        <CustomTextField
          fullWidth
          label={t('project_title')}
          placeholder={t('world_conquest') as string}
          value={props.project.title}
          onChange={e => onFieldUpdate('title', e.target.value)}
        />

        <CustomTextField
          fullWidth
          multiline
          minRows={2}
          label={t('project_description')}
          placeholder={t('world_conquest_desc') as string}
          value={props.project.description}
          onChange={e => onFieldUpdate('description', e.target.value)}
        />
        <LoadingButton
          onClick={() => props.onRemove(props.index)}
          id='delete-button'
          data-testid='delete-button'
          variant='outlined'
          color='secondary'
        >
          {t('remove_project')}
        </LoadingButton>
      </Box>
    </Grid>
  )
}
