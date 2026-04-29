// src/types/page.ts

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  children?: {
    _type: 'span'
    text: string
    _key: string
  }[]
}

export type SanityImage = {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export type Page = {
  _id: string
  _createdAt: string
  title: string
  slug: string
  pageType?: 'homepage' | 'about' | 'contact'
  intro?: string
  content?: PortableTextBlock[]
  heroImage?: SanityImage
  portrait?: SanityImage
  heroVideoUrl?: string
  email?: string
  phone?: string
  address?: string
}