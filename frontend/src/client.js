import {createClient} from '@sanity/client'

import imageUrlBuilder from '@sanity/image-url';


export const client =  createClient({

    projectId:`${import.meta.env.VITE_SANITY_PROJECT_ID}`,
    dataset:"shareme",
    apiVersion:'2023-05-03',
    useCdn:true,
    token:`${import.meta.env.VITE_SANIY_PROJECT_TOKEN}`,
});

const builder = imageUrlBuilder(client)
export const urlFor = (source)=> builder.image(source)