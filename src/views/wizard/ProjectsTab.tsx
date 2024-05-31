import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUniqueId, isString } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { projectImageDelete, projectImageUpload, setWizardState } from 'src/store/apps/wizard'
import NewProject from 'src/views/wizard/NewProject'

export default function ProjectsTab() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onChange = async (projects: Array<any>) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          projects
        }
      })
    )
  }

  const onImageChange = (image: any, index: number) => {
    const project = { ...wizard.details.projects[index] }
    project.image = image
    const projects = [...wizard.details.projects]
    projects[index] = project
    onChange(projects)
  }

  const onNew = () => {
    const project = {
      title: '',
      description: '',
      image: null,
      imageType: null,
      prompt: '',
      aiImages: null,
      uploading: false,
      deleting: false,
      generating: false
    }
    const projects = [...wizard.details.projects, project]
    onChange(projects)
  }

  const onRemove = async (index: number) => {
    const projects = wizard.details.projects.filter((_: any, i: number) => i !== index)
    onChange(projects)
  }

  const onUpload = async (index: number) => {
    let id = getUniqueId()
    const user = session?.user
    if (user && user.id) id = user.id
    dispatch(projectImageUpload({ id, file: wizard.details.projects[index].image, index }))
  }

  const onDelete = async (index: number) => {
    if (!isString(wizard.details.projects[index].image)) toast.error(t('no_file_selected'))
    else dispatch(projectImageDelete({ file: wizard.details.projects[index].image, index }))
  }

  const onClear = (index: number) => {
    const project = { ...wizard.details.projects[index] }
    project.image = null
    project.imageType = null
    const projects = [...wizard.details.projects]
    projects[index] = project
    onChange(projects)
  }

  const onOpenImagesLibrary = (index: number) => {
    dispatch(
      setWizardState({
        ...wizard,
        imagesLibrary: {
          ...wizard.imagesLibrary,
          showUnsplashDialog: true,
          target: 'projects',
          index
        }
      })
    )
  }

  return (
    <TabPanel value='projects' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <LoadingButton onClick={onNew} id='add-button' data-testid='add-button' variant='outlined' color='primary'>
            {t('add_project')}
          </LoadingButton>
        </Grid>
        {wizard.details.projects.map((project: any, index: number) => (
          <NewProject
            key={`project${index}`}
            index={index}
            project={project}
            projects={wizard.details.projects}
            onChange={onChange}
            onRemove={onRemove}
            onImageChange={onImageChange}
            onUpload={onUpload}
            onDelete={onDelete}
            onClear={onClear}
            onOpenImagesLibrary={onOpenImagesLibrary}
          />
        ))}
      </Grid>
    </TabPanel>
  )
}
