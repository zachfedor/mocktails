import { Link, useLoaderData } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/index.ts'

export async function loader({}: Route.LoaderArgs) {
	const places = await prisma.place.findMany()

	return {
		places,
	}
}

export default function BarsIndex() {
	const { places } = useLoaderData<typeof loader>()

	return (
		<main className="container flex flex-1 flex-col items-center py-16">
			<h1 className="pb-12 text-4xl">Bars Nearby 📍</h1>

			<ul className="flex flex-col gap-4">
				{places.map(({ id, name, slug }) => (
					<li key={id}>
						<Link className="text-xl hover:text-rose-600" to={`/bars/${slug}`}>
							{name}
						</Link>
					</li>
				))}
			</ul>
		</main>
	)
}
