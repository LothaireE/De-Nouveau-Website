import { getSingleProject } from "@/library/sanity/fetchers";
import Image from "next/image";
import { notFound } from "next/navigation";


export default async function SingleProjectPage ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const project = await getSingleProject(slug)

  if (!project) notFound();  
     
    return (
        <div>
            {project && (
              <div>
                <h1>{project.title}</h1>
                <p>{project.shortDescription}</p>
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  width={550}
                  height={300}
                  className="object-cover rounded-lg border border-gray-500"
                />
              </div>
            )}
        </div>
    );
};


