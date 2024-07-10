import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sleep } from 'src/@core/utils'
import { deleteFile, uploadFile } from 'src/api/gcp'
import { BUCKET_NAME } from 'src/types/constants'
import { FileProp } from 'src/views/wizard/LogoUploader'

export const generateWebsite = createAsyncThunk('wizard/generateWebsite', async (args: any, thunkAPI) => {
  try {
    await sleep(7000)
    const generated = true
    const siteShot = '/siteshot.png'

    return { generated, siteShot }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const logosGenerate = createAsyncThunk('wizard/logosGenerate', async (args: any, thunkAPI) => {
  try {
    await sleep(5000)

    return {
      logos: [
        'https://safha-frontend.vercel.app/logo.png',
        'https://safha-frontend.vercel.app/logo.png',
        'https://safha-frontend.vercel.app/logo.png',
        'https://safha-frontend.vercel.app/logo.png'
      ]
    }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const projectImagesGenerate = createAsyncThunk('wizard/projectImagesGenerate', async (args: any, thunkAPI) => {
  const { index } = args

  try {
    await sleep(5000)

    return {
      index,
      images: [
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png'
      ]
    }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const productImagesGenerate = createAsyncThunk('wizard/productImagesGenerate', async (args: any, thunkAPI) => {
  const { index } = args

  try {
    await sleep(5000)

    return {
      index,
      images: [
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png'
      ]
    }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const logoUpload = createAsyncThunk('wizard/logoUpload', async (args: any, thunkAPI) => {
  try {
    const { id, file } = args
    const formData = new FormData()
    formData.append('bucketName', BUCKET_NAME)
    formData.append('folderName', `${id}/`)
    formData.append('file', file)
    const uploadRes = await uploadFile(formData)

    return { url: uploadRes.data.url }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const photoUpload = createAsyncThunk('wizard/photoUpload', async (args: any, thunkAPI) => {
  const { id, file, index } = args
  try {
    const formData = new FormData()
    formData.append('bucketName', BUCKET_NAME)
    formData.append('folderName', `${id}/`)
    formData.append('file', file)
    const uploadRes = await uploadFile(formData)

    return { url: uploadRes.data.url, index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const projectImageUpload = createAsyncThunk('wizard/projectImageUpload', async (args: any, thunkAPI) => {
  const { id, file, index } = args
  try {
    const formData = new FormData()
    formData.append('bucketName', BUCKET_NAME)
    formData.append('folderName', `${id}/`)
    formData.append('file', file)
    const uploadRes = await uploadFile(formData)

    return { url: uploadRes.data.url, index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const galleryImageUpload = createAsyncThunk('wizard/galleryImageUpload', async (args: any, thunkAPI) => {
  const { id, file } = args
  try {
    const formData = new FormData()
    formData.append('bucketName', BUCKET_NAME)
    formData.append('folderName', `${id}/`)
    formData.append('file', file)
    const uploadRes = await uploadFile(formData)

    return { url: uploadRes.data.url }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const productImageUpload = createAsyncThunk('wizard/productImageUpload', async (args: any, thunkAPI) => {
  const { id, file, index } = args
  try {
    const formData = new FormData()
    formData.append('bucketName', BUCKET_NAME)
    formData.append('folderName', `${id}/`)
    formData.append('file', file)
    const uploadRes = await uploadFile(formData)

    return { url: uploadRes.data.url, index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const logoDelete = createAsyncThunk('wizard/logoDelete', async (args: any, thunkAPI) => {
  try {
    const { file } = args
    const bucketName = file.split('/')[3]
    const fileName = `${file.split('/')[4]}/${file.split('/')[5]}`
    await deleteFile({ bucketName, fileName })
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

export const photoDelete = createAsyncThunk('wizard/photoDelete', async (args: any, thunkAPI) => {
  const { file, index } = args
  try {
    const bucketName = file.split('/')[3]
    const fileName = `${file.split('/')[4]}/${file.split('/')[5]}`
    await deleteFile({ bucketName, fileName })

    return { index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const projectImageDelete = createAsyncThunk('wizard/projectImageDelete', async (args: any, thunkAPI) => {
  const { file, index } = args
  try {
    const bucketName = file.split('/')[3]
    const fileName = `${file.split('/')[4]}/${file.split('/')[5]}`
    await deleteFile({ bucketName, fileName })

    return { index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const productImageDelete = createAsyncThunk('wizard/productImageDelete', async (args: any, thunkAPI) => {
  const { file, index } = args
  try {
    const bucketName = file.split('/')[3]
    const fileName = `${file.split('/')[4]}/${file.split('/')[5]}`
    await deleteFile({ bucketName, fileName })

    return { index }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue({ index })
  }
})

export const deleteWebsite = createAsyncThunk('wizard/deleteWebsite', async (_: any, thunkAPI) => {
  try {
    await sleep(5000)

    return { deleted: true }
  } catch (error) {
    console.error(error)

    return thunkAPI.rejectWithValue('An unexpected error occurred')
  }
})

type WizardStateType = {
  language: 'ar' | 'en'
  step: number
  type: string
  sections: Array<'about' | 'team' | 'services' | 'projects' | 'products' | 'endorsements' | 'gallery' | null>
  details: {
    active: 'brand' | 'about' | 'team' | 'services' | 'projects' | 'products' | 'endorsements' | 'gallery'
    brand: {
      logo: FileProp | string | null
      type: 'upload' | 'generate' | null
      aiLogo: string | null
      aiLogos: string[]
      primaryColor: string
      fontFamily: string
      dimensions: { width: number; height: number }
      prompt: string
      generating: boolean
      uploading: boolean
      deleting: boolean
    }
    about: {
      name: string
      email: string
      phoneNumber: string
      location: string
      whatDoYouDo: string
      socials: string
    }
    team: Array<{
      name: string
      title: string
      bio: string
      photo: string | null
      uploading: boolean
      deleting: boolean
    }>
    services: Array<{ title: string; description: string }> | null
    projects: Array<{
      title: string
      description: string
      image: string | null
      imageType: 'generate' | 'upload' | 'library' | null
      prompt: string
      aiImages: Array<string> | null
      uploading: boolean
      deleting: boolean
      generating: boolean
    }>
    products: Array<{
      title: string
      description: string
      image: string | null
      imageType: 'generate' | 'upload' | 'library' | null
      prompt: string
      aiImages: Array<string> | null
      uploading: boolean
      deleting: boolean
      generating: boolean
    }>
    endorsements: Array<{ name: string; endorsement: string }> | null
    gallery: {
      images: Array<string>
      image: string | null
      uploading: boolean
    }
  }
  playFireworks: boolean
  generating: boolean
  generated: boolean
  preview: string | null
  showResetDialog: boolean
  imagesLibrary: {
    showUnsplashDialog: boolean
    images: Array<string> | null
    target: 'projects' | 'products' | null
    index: number | null
  }
  deleting: boolean
}

export const wizardInitialState: WizardStateType = {
  language: 'en',
  step: 0,
  type: 'business',
  sections: ['about', 'team', 'services', 'projects', 'products', 'endorsements', 'gallery'],
  details: {
    active: 'brand',
    brand: {
      logo: null,
      type: null,
      aiLogo: null,
      aiLogos: [],
      primaryColor: '#50F5AC',
      fontFamily: 'cairo',
      dimensions: { width: 165, height: 165 },
      uploading: false,
      deleting: false,
      prompt: '',
      generating: false
    },
    about: {
      name: 'Safha LLC',
      email: 'me@younes.expert  ',
      phoneNumber: '+966538654514',
      location: 'Riyadh, Saudi Arabia',
      whatDoYouDo:
        'Safha is building a product that allows anyone to create a website with AI in minutes. Includes, Brand Generator, CMS, CRM, Web Payments, AI Booking Management, and Automated Blogging.',
      socials:
        'https://twitter.com/safha_com\nhttps://www.instagram.com/safha_com/\nhttps://www.linkedin.com/company/101410623/admin/feed/posts/\nhttps://github.com/safhacom'
    },
    team: [
      {
        name: 'Younes Alturkey',
        title: 'CEO',
        bio: 'A visionary software engineer and serial entrepreneur dedicated to revolutionizing economies and creating groundbreaking unicorn enterprises.',
        photo: 'https://safha-frontend.vercel.app/younes.jpg',
        uploading: false,
        deleting: false
      },
      {
        name: 'Abdullah Alhazmi',
        title: 'President',
        bio: 'Engineering architect and entrepreneur crafting disruptive tech and dynamic culture, blending innovation with teamwork for industry change.',
        photo: 'https://safha-frontend.vercel.app/abdullah.jpeg',
        uploading: false,
        deleting: false
      },
      {
        name: 'Faris Alahmadi',
        title: 'Chief Scientist',
        bio: 'AI researcher and engineer driven to lead the AI revolution in MENA, aiming to create groundbreaking, transformative AI technologies.',
        photo: 'https://safha-frontend.vercel.app/faris.jpeg',
        uploading: false,
        deleting: false
      }
    ],
    services: [
      {
        title: 'Frontend Development',
        description:
          'Frontend development involves creating the user interface and experience of a website or web application. Developers use HTML, CSS, and JavaScript to design, build, and optimize the part of the website that users interact with directly.'
      },
      {
        title: 'Backend Development',
        description:
          'Backend development refers to the server-side software development that focuses on databases, scripting, and website architecture. It operates behind the scenes, enabling the front end to function, and includes tasks like database management, server configuration, and API integration.'
      },
      {
        title: 'Fullstack Development',
        description:
          'Fullstack development involves working on both the frontend and backend parts of web applications. The frontend refers to the part of the application users interact with directly, while the backend involves servers, databases, and application logic. Fullstack developers are skilled in technologies across both domains to build complete, functional software solutions.'
      }
    ],
    projects: [
      {
        title: 'Baboon Tracking System',
        description:
          'A baboon tracking system utilizes technology such as GPS collars and tracking software to monitor and study the movements, behaviors, and habitats of baboons. This system aids in wildlife research and conservation efforts, providing valuable data on baboon populations and their interactions with the environment.',
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      },
      {
        title: 'FlyMizar Website',
        description:
          'FlyMizar is an airline booking website that offers users the ability to search for, compare, and book flights. It provides a user-friendly interface with options for filtering flights by price, duration, and airline, along with additional travel services such as hotel bookings and car rentals.',
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      },
      {
        title: 'ERP System for Child Care',
        description: `An ERP (Enterprise Resource Planning) system for child care centralizes and streamlines the management of a child care facility's operations. It integrates various functions such as enrollment, billing, scheduling, staff management, and communication with parents into a single platform, improving efficiency and enhancing the quality of child care services.`,
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      }
    ],
    products: [
      {
        title: 'Amazing Shoes',
        description:
          'Stylish and comfortable shoes designed for everyday wear, featuring a sleek, modern look with a durable sole and breathable material. Perfect for both casual outings and formal occasions.',
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      },
      {
        title: 'The Sunglasses',
        description: `"The Sunglasses" is a short film about an introverted teenager who discovers a pair of sunglasses that allow him to read people's thoughts. As he navigates his high school's social landscape, he must decide whether to use his new power for personal gain or for the greater good. The film explores themes of privacy, ethics, and the challenges of adolescence.`,
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      },
      {
        title: 'Power Powder',
        description:
          'Power Powder is a fictional substance often depicted in video games and comic books as a magical or highly scientific compound that can bestow temporary superhuman abilities, increased strength, or other enhanced attributes upon its users. It typically appears as a brightly colored, fine powder and is used by characters to gain an advantage in battles or missions.',
        image: null,
        imageType: null,
        prompt: '',
        aiImages: null,
        uploading: false,
        deleting: false,
        generating: false
      }
    ],
    endorsements: [
      {
        name: 'Younes Alturkey',
        endorsement: 'Wow! This is great I love it. I will recommend it to all my friends.'
      },
      {
        name: 'Faris Alahmadi',
        endorsement: 'Wow! This is great I love it. I will recommend it to all my friends.'
      },
      {
        name: 'Abdullah Alhazmi',
        endorsement: 'Wow! This is great I love it. I will recommend it to all my friends.'
      }
    ],
    gallery: {
      images: [
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png',
        'https://safha-frontend.vercel.app/safha-main.png'
      ],
      image: null,
      uploading: false
    }
  },
  playFireworks: false,
  generating: false,
  generated: false,
  preview: null,
  showResetDialog: false,
  imagesLibrary: {
    showUnsplashDialog: false,
    images: null,
    target: null,
    index: null
  },
  deleting: false
}

export const wizardSlice = createSlice({
  name: 'wizard',
  initialState: wizardInitialState,
  reducers: {
    setWizardState: (state, action) => {
      state.step = action.payload.step
      state.sections = action.payload.sections
      state.type = action.payload.type
      state.details = action.payload.details
      state.playFireworks = action.payload.playFireworks
      state.generating = action.payload.generating
      state.generated = action.payload.generated
      state.preview = action.payload.preview
      state.language = action.payload.language
      state.showResetDialog = action.payload.showResetDialog
      state.imagesLibrary = action.payload.imagesLibrary
    }
  },
  extraReducers: builder => {
    builder.addCase(generateWebsite.fulfilled, (state, action) => {
      const { generated, siteShot } = action.payload
      state.generated = generated
      state.preview = siteShot
      state.playFireworks = true
      state.generating = false
    })
    builder.addCase(generateWebsite.pending, state => {
      state.generating = true
    })
    builder.addCase(generateWebsite.rejected, state => {
      state.generating = false
    })

    builder.addCase(logosGenerate.fulfilled, (state, action) => {
      const { logos } = action.payload
      state.details.brand.aiLogos = logos
      state.details.brand.prompt = ''
      state.details.brand.generating = false
    })
    builder.addCase(logosGenerate.pending, state => {
      state.details.brand.generating = true
    })
    builder.addCase(logosGenerate.rejected, state => {
      state.details.brand.generating = false
    })

    builder.addCase(projectImagesGenerate.fulfilled, (state, action) => {
      const { index, images } = action.payload
      const project = state.details.projects[index]
      project.aiImages = images
      project.generating = false
      state.details.projects[index] = project
    })
    builder.addCase(projectImagesGenerate.pending, (state, action) => {
      const { index } = action.meta.arg
      const project = state.details.projects[index]
      project.generating = true
      state.details.projects[index] = project
    })
    builder.addCase(projectImagesGenerate.rejected, (state, action) => {
      const { index } = action.payload as any
      const project = state.details.projects[index]
      project.generating = false
      state.details.projects[index] = project
    })

    builder.addCase(productImagesGenerate.fulfilled, (state, action) => {
      const { index, images } = action.payload
      const product = state.details.products[index]
      product.aiImages = images
      product.generating = false
      state.details.products[index] = product
    })
    builder.addCase(productImagesGenerate.pending, (state, action) => {
      const { index } = action.meta.arg
      const product = state.details.products[index]
      product.generating = true
      state.details.products[index] = product
    })
    builder.addCase(productImagesGenerate.rejected, (state, action) => {
      const { index } = action.payload as any
      const product = state.details.products[index]
      product.generating = false
      state.details.products[index] = product
    })

    builder.addCase(logoUpload.fulfilled, (state, action) => {
      const { url } = action.payload
      state.details.brand.logo = url
      state.details.brand.uploading = false
    })
    builder.addCase(logoUpload.pending, state => {
      state.details.brand.uploading = true
    })
    builder.addCase(logoUpload.rejected, state => {
      state.details.brand.uploading = false
    })

    builder.addCase(photoUpload.fulfilled, (state, action) => {
      const { url, index } = action.payload
      const member = state.details.team[index]
      member.photo = url
      member.uploading = false
      state.details.team[index] = member
    })
    builder.addCase(photoUpload.pending, (state, action) => {
      const { index } = action.meta.arg
      const member = state.details.team[index]
      member.uploading = true
      state.details.team[index] = member
    })
    builder.addCase(photoUpload.rejected, (state, action) => {
      const { index } = action.payload as any
      const member = state.details.team[index]
      member.uploading = false
      state.details.team[index] = member
    })

    builder.addCase(galleryImageUpload.fulfilled, (state, action) => {
      const { url } = action.payload
      const gallery = { ...state.details.gallery }
      gallery.images = [...gallery.images, url]
      gallery.image = null
      gallery.uploading = false
      state.details.gallery = gallery
    })
    builder.addCase(galleryImageUpload.pending, state => {
      const gallery = { ...state.details.gallery }
      gallery.uploading = true
      state.details.gallery = gallery
    })
    builder.addCase(galleryImageUpload.rejected, state => {
      const gallery = { ...state.details.gallery }
      gallery.uploading = false
      state.details.gallery = gallery
    })

    builder.addCase(projectImageUpload.fulfilled, (state, action) => {
      const { url, index } = action.payload
      const project = state.details.projects[index]
      project.image = url
      project.uploading = false
      state.details.projects[index] = project
    })
    builder.addCase(projectImageUpload.pending, (state, action) => {
      const { index } = action.meta.arg
      const project = state.details.projects[index]
      project.uploading = true
      state.details.projects[index] = project
    })
    builder.addCase(projectImageUpload.rejected, (state, action) => {
      const { index } = action.payload as any
      const project = state.details.projects[index]
      project.uploading = false
      state.details.projects[index] = project
    })

    builder.addCase(productImageUpload.fulfilled, (state, action) => {
      const { url, index } = action.payload
      const product = state.details.products[index]
      product.image = url
      product.uploading = false
      state.details.products[index] = product
    })
    builder.addCase(productImageUpload.pending, (state, action) => {
      const { index } = action.meta.arg
      const product = state.details.products[index]
      product.uploading = true
      state.details.products[index] = product
    })
    builder.addCase(productImageUpload.rejected, (state, action) => {
      const { index } = action.payload as any
      const product = state.details.products[index]
      product.uploading = false
      state.details.products[index] = product
    })

    builder.addCase(logoDelete.fulfilled, state => {
      state.details.brand.logo = null
      state.details.brand.type = null
      state.details.brand.dimensions = { width: 165, height: 165 }
      state.details.brand.deleting = false
    })
    builder.addCase(logoDelete.pending, state => {
      state.details.brand.deleting = true
    })
    builder.addCase(logoDelete.rejected, state => {
      state.details.brand.deleting = false
    })

    builder.addCase(photoDelete.fulfilled, (state, action) => {
      const { index } = action.payload
      const member = state.details.team[index]
      member.photo = null
      member.deleting = false
      state.details.team[index] = member
    })
    builder.addCase(photoDelete.pending, (state, action) => {
      const { index } = action.meta.arg
      const member = state.details.team[index]
      member.deleting = true
      state.details.team[index] = member
    })
    builder.addCase(photoDelete.rejected, (state, action) => {
      const { index } = action.payload as any
      const member = state.details.team[index]
      member.deleting = false
      state.details.team[index] = member
    })

    builder.addCase(projectImageDelete.fulfilled, (state, action) => {
      const { index } = action.payload
      const project = state.details.projects[index]
      project.image = null
      project.deleting = false
      state.details.projects[index] = project
    })
    builder.addCase(projectImageDelete.pending, (state, action) => {
      const { index } = action.meta.arg
      const project = state.details.projects[index]
      project.deleting = true
      state.details.projects[index] = project
    })
    builder.addCase(projectImageDelete.rejected, (state, action) => {
      const { index } = action.payload as any
      const project = state.details.projects[index]
      project.deleting = true
      state.details.projects[index] = project
    })

    builder.addCase(productImageDelete.fulfilled, (state, action) => {
      const { index } = action.payload
      const product = state.details.products[index]
      product.image = null
      product.deleting = false
      state.details.products[index] = product
    })
    builder.addCase(productImageDelete.pending, (state, action) => {
      const { index } = action.meta.arg
      const product = state.details.products[index]
      product.deleting = true
      state.details.products[index] = product
    })
    builder.addCase(productImageDelete.rejected, (state, action) => {
      const { index } = action.payload as any
      const product = state.details.products[index]
      product.deleting = true
      state.details.products[index] = product
    })

    builder.addCase(deleteWebsite.fulfilled, state => {
      state.deleting = false
    })
    builder.addCase(deleteWebsite.pending, state => {
      state.deleting = true
    })
    builder.addCase(deleteWebsite.rejected, state => {
      state.deleting = false
    })
  }
})

export const { setWizardState } = wizardSlice.actions

export default wizardSlice.reducer
