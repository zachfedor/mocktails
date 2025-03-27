import { invariantResponse } from '@epic-web/invariant'
import { Link, Outlet, useLoaderData } from 'react-router'
import { NavLink } from '#app/root'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$slug.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const place = await prisma.place.findFirst({
		select: {
			id: true,
			name: true,
			address: true,
			hours: true,
			slug: true,
			notes: {
				select: {
					id: true,
				},
			},
			cocktails: {
				select: {
					id: true,
				},
			},
		},
		where: { slug: params.slug },
	})

	invariantResponse(place, 'Place not found', { status: 404 })

	return { place }
}

export default function BarsIndex() {
	const { place } = useLoaderData<typeof loader>()

	return (
		<main className="container flex flex-1 flex-col items-center py-16">
			<p className="self-start pb-12">
				<Link to="/bars">⬅️ back</Link>
			</p>

			<h1 className="pb-12 text-4xl">{place.name}</h1>

			<p className="pb-24">{place.address}</p>

			<nav className="flex gap-12 pb-12">
				<NavLink to={`/bars/${place.slug}`} end>
					Reviews ({place.notes.length})
				</NavLink>
				<NavLink to={`/bars/${place.slug}/menu`}>
					Menu ({place.cocktails.length})
				</NavLink>
			</nav>

			<Outlet />
		</main>
	)
}
