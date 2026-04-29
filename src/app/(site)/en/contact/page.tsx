import React from 'react';
import { createMetadata } from '@/library/seo';


export const metadata = createMetadata({
    title: 'Contact from Nouveau',
    description: 'This is the contact page of De Nouveau',
    path: '/contact',
    locale: 'fr_FR',
    image: "https://www.de-nouveau.com/images/contact.jpg",
});





export default function ContactPage () {

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Contact from De Nouveau</h2>
        </div>
    );
};
