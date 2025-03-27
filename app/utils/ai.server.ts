import Anthropic from '@anthropic-ai/sdk'
import { invariant } from '@epic-web/invariant'
import { type fetchGoogleDetails } from '#app/utils/googlePlaces.server'

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
})

type Place = Awaited<ReturnType<typeof fetchGoogleDetails>>
type Cocktail = {
	name: string
	description: string
	ingredients: string[]
	rating: number
}

export async function createCocktailList(place: Place) {
	invariant(place, 'No google places data to summarize')

	const { reviews = [], ...info } = place

	const msg = await anthropic.messages.create({
		model: 'claude-3-7-sonnet-20250219',
		max_tokens: 20000,
		temperature: 1,
		system:
			'You are a yuppie blogger reviewing cocktails in a small but diverse and artsy city with a thriving tech community.',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `You are tasked with generating mock data for a cocktail review platform based on information from a restaurant or bar that serves cocktails. I will provide you with basic information about the place and a few user reviews. Your job is to create an array of cocktails with their names, descriptions, ingredients, and ratings.

Here's the place information:
<place_info>
${JSON.stringify(info)}
</place_info>

Here are some user reviews:
<reviews>
${JSON.stringify(reviews)}
</reviews>

Analyze the provided information carefully. Pay attention to any mentions of specific cocktails, flavors, or ingredients in both the place information and the reviews.

To generate the mock cocktail data, follow these steps:

1. Extract cocktail names:
   - Identify any cocktails mentioned explicitly in the place info or reviews.
   - If fewer than 5 cocktails are mentioned, infer additional cocktail names that would fit the establishment's style and theme.
2. Create descriptions:
   - For each cocktail, write a brief (1-2 sentence) description that captures its essence, flavors, and appeal.
   - Use creative language that matches the tone of the establishment.
3. Generate ingredient lists:
   - For each cocktail, create a list of 3-5 ingredients that would likely be used in its preparation.
   - Ensure the ingredients are plausible and fit the cocktail's description.
4. Assign ratings:
   - Give each cocktail an overall rating between 1.0 and 5.0.
   - Base the ratings on any mentions in the reviews or infer them from the general sentiment about the place.
   - Use one decimal place for precision (e.g., 4.2, 3.7).

Present your output as an array of cocktail objects, each containing the following properties:
- name: The name of the cocktail (string)
- description: A brief description of the cocktail (string)
- ingredients: An array of ingredients (array of strings)
- rating: The overall rating of the cocktail (number with one decimal place)

Here's an example of how your output should be formatted:

<output>
[{
  "name": "Sunset Serenade",
  "description": "A refreshing blend of tropical fruits and premium rum, perfect for sipping on a warm evening.",
  "ingredients": ["White rum", "Passion fruit puree", "Pineapple juice", "Lime juice", "Grenadine"],
  "rating": 4.3
}, {
  "name": "Smoky Nightcap",
  "description": "A sophisticated mix of smoky mezcal and sweet vermouth, garnished with a twist of orange.",
  "ingredients": ["Mezcal", "Sweet vermouth", "Angostura bitters", "Orange peel"],
  "rating": 4.7
}]
</output>

Generate an array of at least 5 cocktails based on the provided information. Be creative while ensuring the cocktails fit the style and theme of the establishment. Present your final output within <output> tags.
`,
					},
				],
			},
		],
	})

	// Concatenate any text blocks generated in content
	const text = msg.content.reduce(
		(acc, cur) => (cur.type === 'text' ? `${acc}\n\n${cur.text}` : acc),
		'',
	)
	// Then extract the output that should hopefully be tagged
	const output = text
		.slice(text.indexOf('<output>') + 8, text.indexOf('</output>'))
		.trim()

	const cocktails = JSON.parse(output) as Cocktail[]

	invariant(
		cocktails && Array.isArray(cocktails),
		'Generated cocktail list is not expected type',
	)

	return cocktails
}
