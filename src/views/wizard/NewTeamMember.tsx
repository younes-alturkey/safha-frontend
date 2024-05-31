import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import SingleMediaUploader from 'src/@core/components/media-uploader/single'
import CustomTextField from 'src/@core/components/mui/text-field'
import { isUrl } from 'src/@core/utils'

type Member = {
  name: string
  title: string
  bio: string
  photo: string | null
  uploading: boolean
  deleting: boolean
}

interface NewTeamMemberProps {
  index: number
  member: Member
  team: Array<Member>
  onTeamChange: (team: Array<any>) => Promise<void>
  onRemove: (index: number) => Promise<void>
  onPhotoChange: (photo: any, index: number) => void
  onUpload: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onClear: (index: number) => void
}

export default function NewTeamMember(props: NewTeamMemberProps) {
  const { t } = useTranslation()

  const onFieldUpdate = (field: string, value: string) => {
    const member = { ...props.team[props.index] } as any
    member[field] = value
    const team = [...props.team]
    team[props.index] = member
    props.onTeamChange(team)
  }

  return (
    <Grid item xs={12} display='flex' justifyContent='flex-start' alignItems='flex-start' gap={4}>
      <SingleMediaUploader
        title={`${t('member_photo')} (${t('optional')})`}
        file={props.member.photo}
        isUploaded={isUrl(props.member.photo)}
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        }}
        uploading={props.member.uploading}
        deleting={props.member.deleting}
        disabled={false}
        onFileChange={(file: any) => props.onPhotoChange(file, props.index)}
        onUpload={async () => props.onUpload(props.index)}
        onDelete={async () => props.onDelete(props.index)}
        onClear={() => props.onClear(props.index)}
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
          label={t('member_name')}
          placeholder={t('younes_alturkey') as string}
          value={props.member.name}
          onChange={e => onFieldUpdate('name', e.target.value)}
        />

        <CustomTextField
          fullWidth
          label={t('member_title')}
          placeholder={t('ceo') as string}
          value={props.member.title}
          onChange={e => onFieldUpdate('title', e.target.value)}
        />

        <CustomTextField
          fullWidth
          multiline
          minRows={4}
          label={t('member_bio')}
          placeholder={t('bio_placeholder') as string}
          value={props.member.bio}
          onChange={e => onFieldUpdate('bio', e.target.value)}
        />
        <LoadingButton
          onClick={() => props.onRemove(props.index)}
          id='delete-button'
          data-testid='delete-button'
          variant='outlined'
          color='secondary'
        >
          {t('remove_member')}
        </LoadingButton>
      </Box>
    </Grid>
  )
}
