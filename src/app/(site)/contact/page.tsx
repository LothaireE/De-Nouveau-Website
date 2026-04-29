
import { createMetadata } from '@/library/seo';
import { getPage } from '@/library/sanity/fetchers';

export const metadata = createMetadata({
  title: 'Contacter De Nouveau',
  description: 'Ceci est la page contact de De Nouveau',
  path: '/about',
  locale: 'fr_FR',
  image: "https://www.de-nouveau.com/images/contact.jpg",
});


/**
 * TODO
 Contenu :
- email ;
- téléphone ;
- adresse ;
- liens réseaux sociaux ;
- carte uniquement si nécessaire, sinon éviter pour la performance.
 */

const  SLUG = "contact"

export default async function ContactPage () {

    const contact = await getPage(SLUG);
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">{contact?.title}</h2>
        </div>
    );
};
