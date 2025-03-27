import { invariantResponse } from '@epic-web/invariant'
import { useLoaderData } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$slug.menu.ts'

const isIngredients = (x: any): x is string[] =>
	x && Array.isArray(x) && x.every((e) => typeof e === 'string')

export async function loader({ params }: Route.LoaderArgs) {
	const place = await prisma.place.findFirst({
		select: {
			cocktails: {
				select: {
					id: true,
					name: true,
					description: true,
					ingredients: true,
					rating: true,
				},
			},
		},
		where: { slug: params.slug },
	})

	invariantResponse(place, 'Place not found', { status: 404 })

	return {
		cocktails: place.cocktails.map(({ ingredients, ...rest }) => ({
			...rest,
			ingredients: isIngredients(ingredients) ? ingredients : [],
		})),
	}
}

export default function BarMenu() {
	const { cocktails } = useLoaderData<typeof loader>()

	return cocktails.length === 0 ? (
		<h2 className="text-2xl">No Menu Yet</h2>
	) : (
		<ol>
			{cocktails.map((cocktail) => (
				<li key={cocktail.id}>
					<h2 id="note-title" className="mb-2 pt-12 text-h2 lg:mb-6">
						{cocktail.name} <span className="pl-6">⭐ {cocktail.rating}</span>
					</h2>

					<p className="pb-4 text-lg">{cocktail.description}</p>

					<h3 className="text-h5 text-rose-800">Ingredients</h3>
					<ul className="ml-6 list-disc">
						{cocktail.ingredients.map((ingredient) => (
							<li key={ingredient}>{ingredient}</li>
						))}
					</ul>
				</li>
			))}
		</ol>
	)
}
