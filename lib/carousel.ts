import { works } from './works'

// The home slideshow: a curated sequence of photographs. List paths here
// (e.g. '/carousel/001.jpg' for public/carousel/001.jpg) to curate it; while the
// list is empty, it shows every image from every project.
const curated: string[] = []

const worksByImage = new Map(works.flatMap((work) => work.images.map((image) => [image.src, work] as const)))
export const carouselWork = (src: string) => worksByImage.get(src)

export const carouselImages: readonly string[] = curated.length ? curated : works.flatMap((work) => work.images.map((image) => image.src))
