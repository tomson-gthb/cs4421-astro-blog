import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const citiesAndRegions = defineCollection({
    loader: glob({ base: './src/content/citiesAndRegions', pattern: '**/*.md' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            heroImage: z.optional(image()),
        }),
});

const islands = defineCollection({
    loader: glob({ base: './src/content/islands', pattern: '**/*.md' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            heroImage: z.optional(image()),
        }),
});

const parks = defineCollection({
    loader: glob({ base: './src/content/parks', pattern: '**/*.md' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            heroImage: z.optional(image()),
        }),
});

const sports = defineCollection({
    loader: glob({ base: './src/content/sports', pattern: '**/*.md' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            heroImage: z.optional(image()),
	    showWeather: z.boolean().optional(),
        }),
});


export const collections = { 
    citiesAndRegions, 
    islands, 
    parks, 
    sports 
};
