import { getPage } from "@/library/payload/fetchers";
import { createMetadata } from "@/library/seo";
import dynamic from "next/dynamic";

const HomeHero = dynamic(() => import("@/components/home/HomeHero"), {
    loading: () => <div className="min-h-screen bg-neutral-100" />,
});

// const ProjectGallery = dynamic(
//     () => import("@/components/home/ProjectGallery"),
//     {
//         loading: () => <div className="h-96 bg-neutral-100" />,
//     },
// );

export const metadata = createMetadata({
    title: "De Nouveau",
    description: "Studio d'architecture De Nouveau",
    path: "/about",
    locale: "fr_FR",
    image: "/images/about.jpg",
});

const SLUG = "homepage";

export default async function Home() {
    const pageContent = await getPage(SLUG);
    // const projects = await getAllProjects();

    return (
        <main>
            <section>
                <HomeHero content={pageContent} />
                {/* <ProjectGallery projects={projects} /> */}
            </section>
        </main>
    );
}

/**
 * import { headers as getHeaders } from 'next/headers.js'
 import Image from 'next/image'
 import { getPayload } from 'payload'
 import React from 'react'
 import { fileURLToPath } from 'url'
 
 import config from '@/payload.config'
 import './styles.css'
 
 export default async function HomePage() {
   const headers = await getHeaders()
   const payloadConfig = await config
   const payload = await getPayload({ config: payloadConfig })
   const { user } = await payload.auth({ headers })
 
   const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`
 
   return (
     <div className="home">
       <div className="content">
         <picture>
           <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg" />
           <Image
             alt="Payload Logo"
             height={65}
             src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
             width={65}
           />
         </picture>
         {!user && <h1>Welcome to your new project.</h1>}
         {user && <h1>Welcome back, {user.email}</h1>}
         <div className="links">
           <a
             className="admin"
             href={payloadConfig.routes.admin}
             rel="noopener noreferrer"
             target="_blank"
           >
             Go to admin panel
           </a>
           <a
             className="docs"
             href="https://payloadcms.com/docs"
             rel="noopener noreferrer"
             target="_blank"
           >
             Documentation
           </a>
         </div>
       </div>
       <div className="footer">
         <p>Update this page by editing</p>
         <a className="codeLink" href={fileURL}>
           <code>app/(frontend)/page.tsx</code>
         </a>
       </div>
     </div>
   )
 }
 
 */
