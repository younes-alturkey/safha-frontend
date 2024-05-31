import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUniqueId, isString } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { photoDelete, photoUpload, setWizardState } from 'src/store/apps/wizard'
import NewTeamMember from 'src/views/wizard/NewTeamMember'

export default function TeamTab() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onTeamChange = async (team: Array<any>) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          team
        }
      })
    )
  }

  const onPhotoChange = (photo: any, index: number) => {
    const member = { ...wizard.details.team[index] }
    member.photo = photo
    const team = [...wizard.details.team]
    team[index] = member
    onTeamChange(team)
  }

  const onNew = () => {
    const member = {
      name: '',
      title: '',
      bio: '',
      photo: null,
      uploading: false,
      deleting: false
    }
    const team = [...wizard.details.team, member]
    onTeamChange(team)
  }

  const onRemove = async (index: number) => {
    const team = wizard.details.team.filter((_: any, i: number) => i !== index)
    onTeamChange(team)
  }

  const onUpload = async (index: number) => {
    let id = getUniqueId()
    const user = session?.user
    if (user && user.id) id = user.id
    dispatch(photoUpload({ id, file: wizard.details.team[index].photo, index }))
  }

  const onDelete = async (index: number) => {
    if (!isString(wizard.details.team[index].photo)) toast.error(t('no_file_selected'))
    else dispatch(photoDelete({ file: wizard.details.team[index].photo, index }))
  }

  const onClear = (index: number) => {
    const member = { ...wizard.details.team[index] }
    member.photo = null
    const team = [...wizard.details.team]
    team[index] = member
    onTeamChange(team)
  }

  return (
    <TabPanel value='team' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <LoadingButton onClick={onNew} id='add-button' data-testid='add-button' variant='outlined' color='primary'>
            {t('add_new_member')}
          </LoadingButton>
        </Grid>
        {wizard.details.team.map((member: any, index: number) => (
          <NewTeamMember
            key={`member${index}`}
            index={index}
            member={member}
            team={wizard.details.team}
            onTeamChange={onTeamChange}
            onRemove={onRemove}
            onPhotoChange={onPhotoChange}
            onUpload={onUpload}
            onDelete={onDelete}
            onClear={onClear}
          />
        ))}
      </Grid>
    </TabPanel>
  )
}
