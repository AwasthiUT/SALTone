import { getGallery } from '@/lib/supabase/gallery'
import GalleryView from '@/components/GalleryView'

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getGallery(Number(id))
  return <GalleryView Title={data.title} images={data.images} Credits={data.credits} />
}