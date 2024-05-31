import LoadingButton from '@mui/lab/LoadingButton'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUniqueId, isString } from 'src/@core/utils'
import { AppDispatch } from 'src/store'
import { productImageDelete, productImageUpload, setWizardState } from 'src/store/apps/wizard'
import NewProduct from 'src/views/wizard/NewProduct'

export default function ProductsTab() {
  const { data: session } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const wizard = useSelector((state: any) => state.wizard)
  const { t } = useTranslation()

  const onChange = async (products: Array<any>) => {
    dispatch(
      setWizardState({
        ...wizard,
        details: {
          ...wizard.details,
          products
        }
      })
    )
  }

  const onImageChange = (image: any, index: number) => {
    const product = { ...wizard.details.products[index] }
    product.image = image
    const products = [...wizard.details.products]
    products[index] = product
    onChange(products)
  }

  const onNew = () => {
    const product = {
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
    const projects = [...wizard.details.products, product]
    onChange(projects)
  }

  const onRemove = async (index: number) => {
    const products = wizard.details.products.filter((_: any, i: number) => i !== index)
    onChange(products)
  }

  const onUpload = async (index: number) => {
    let id = getUniqueId()
    const user = session?.user
    if (user && user.id) id = user.id
    dispatch(productImageUpload({ id, file: wizard.details.products[index].image, index }))
  }

  const onDelete = async (index: number) => {
    if (!isString(wizard.details.products[index].image)) toast.error(t('no_file_selected'))
    else dispatch(productImageDelete({ file: wizard.details.products[index].image, index }))
  }

  const onClear = (index: number) => {
    const product = { ...wizard.details.products[index] }
    product.image = null
    product.imageType = null
    const products = [...wizard.details.products]
    products[index] = product
    onChange(products)
  }

  const onOpenImagesLibrary = (index: number) => {
    dispatch(
      setWizardState({
        ...wizard,
        imagesLibrary: {
          ...wizard.imagesLibrary,
          showUnsplashDialog: true,
          target: 'products',
          index
        }
      })
    )
  }

  return (
    <TabPanel value='products' sx={{ p: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <LoadingButton onClick={onNew} id='add-button' data-testid='add-button' variant='outlined' color='primary'>
            {t('add_product')}
          </LoadingButton>
        </Grid>
        {wizard.details.products.map((product: any, index: number) => (
          <NewProduct
            key={`product${index}`}
            index={index}
            product={product}
            products={wizard.details.products}
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
