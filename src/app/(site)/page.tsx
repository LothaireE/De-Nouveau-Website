/*
TODO:
- hero plein écran ou quasi plein écran ;
- image ou vidéo d’ambiance ;
- H1 sobre ;
- court texte d’introduction ;
- lien vers les projets ;
- sélection de 3 à 6 ou + projets mis en avant ;
- accès rapide à About / Contact.
*/
// import { Metadata } from "next";
import Link from 'next/link'
import Image from 'next/image'
import { getAllProjects, getPage } from '@/library/sanity/fetchers'
import { createMetadata } from '@/library/seo'

export const metadata = createMetadata({
  title: 'De Nouveau',
  description: "Studio d'architecture De Nouveau",
  path: '/about',
  locale: 'fr_FR',
  image: '/images/about.jpg',
})

const ProjectListNav = async () => {
  const projectsData = await getAllProjects()

  return (
    <div>
      {projectsData.map((project) => (
        <div key={project._id}>
          <Link href={project.slug} className="hover:cursor-pointer">
            {project.title}
          </Link>
          <Image
            src={project.coverImage}
            alt={project.title}
            width={150}
            height={300}
            className="object-cover rounded-lg border border-gray-500"
          />
        </div>
      ))}
    </div>
  )
}

const SLUG = 'homepage'

export default async function Home() {
  const page = await getPage(SLUG)

  return (
    <main className="">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {page?.title}
      </h1>
      <ProjectListNav />
    </main>
  )
}
