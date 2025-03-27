import { invariantResponse } from '@epic-web/invariant'
import { useLoaderData } from 'react-router'
import { NoteCard } from '#app/components/notes'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$slug.index.ts'

export async function loader({ params }: Route.LoaderArgs) {
	const place = await prisma.place.findFirst({
		select: {
			notes: {
				select: {
					id: true,
					title: true,
					content: true,
					images: {
						select: {
							id: true,
							altText: true,
							objectKey: true,
						},
					},
				},
			},
		},
		where: { slug: params.slug },
	})

	invariantResponse(place, 'Place not found', { status: 404 })

	return { place }
}

export default function BarIndex() {
	const { place } = useLoaderData<typeof loader>()

	return place.notes.length === 0 ? (
		<h2 className="text-2xl">No Reviews Yet</h2>
	) : (
		<ol>
			{place.notes.map((note) => (
				<li key={note.id}>
					<NoteCard note={note} />
				</li>
			))}
		</ol>
	)
}
