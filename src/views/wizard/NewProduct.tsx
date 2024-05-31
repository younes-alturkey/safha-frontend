import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AppDispatch } from 'src/store'
import { productImagesGenerate } from 'src/store/apps/wizard'
import ImageWidget from 'src/views/wizard/ImageWidget'

export type Product = {
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

interface NewProductProps {
  index: number
  product: Product
  products: Array<Product>
  onChange: (team: Array<any>) => Promise<void>
  onRemove: (index: number) => Promise<void>
  onImageChange: (image: any, index: number) => void
  onUpload: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onClear: (index: number) => void
  onOpenImagesLibrary: (index: number) => void
}

export default function NewProduct(props: NewProductProps) {
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onFieldUpdate = (field: string, value: string) => {
    const product = { ...props.products[props.index] } as any
    product[field] = value
    const products = [...props.products]
    products[props.index] = product
    props.onChange(products)
  }

  const onOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof prop === 'string' ? prop : prop.target.value
    const product = { ...wizard.details.products[props.index] }
    const currentImageType = product.imageType
    if (value === currentImageType) product.imageType = null
    else product.imageType = value
    const products = [...wizard.details.products]
    products[props.index] = product
    props.onChange(products)
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
        title={`${t('product_image')} (${t('optional')})`}
        entity={props.product}
        entities={props.products}
        index={props.index}
        onChange={props.onChange}
        onImageChange={props.onImageChange}
        onUpload={props.onUpload}
        onDelete={props.onDelete}
        onClear={props.onClear}
        onOpenImagesLibrary={props.onOpenImagesLibrary}
        onOptionChange={onOptionChange}
        onGenerate={async () =>
          await dispatch(productImagesGenerate({ index: props.index, prompt: props.product.prompt }))
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
          label={t('product_title')}
          placeholder={t('world_conquest') as string}
          value={props.product.title}
          onChange={e => onFieldUpdate('title', e.target.value)}
        />

        <CustomTextField
          fullWidth
          multiline
          minRows={2}
          label={t('product_description')}
          placeholder={t('world_conquest_desc') as string}
          value={props.product.description}
          onChange={e => onFieldUpdate('description', e.target.value)}
        />
        <LoadingButton
          onClick={() => props.onRemove(props.index)}
          id='delete-button'
          data-testid='delete-button'
          variant='outlined'
          color='secondary'
        >
          {t('remove_product')}
        </LoadingButton>
      </Box>
    </Grid>
  )
}
