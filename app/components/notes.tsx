import { type Note, type NoteImage } from '@prisma/client'
import { Img } from 'openimg/react'
import { getNoteImgSrc } from '#app/utils/misc.tsx'

type NoteCardProps = {
	note: Pick<Note, 'title' | 'content'> & {
		images: Pick<NoteImage, 'id' | 'objectKey' | 'altText'>[]
	}
	displayBar?: boolean
}

export function NoteCard({ note, displayBar = false }: NoteCardProps) {
	return (
		<>
			<h2 id="note-title" className="mb-2 pt-12 text-h2 lg:mb-6">
				{note.title}
			</h2>
			<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
				<ul className="flex flex-wrap gap-5 py-5">
					{note.images.map((image) => (
						<li key={image.objectKey}>
							<a href={getNoteImgSrc(image.objectKey)}>
								<Img
									src={getNoteImgSrc(image.objectKey)}
									alt={image.altText ?? ''}
									className="h-32 w-32 rounded-lg object-cover"
									width={512}
									height={512}
								/>
							</a>
						</li>
					))}
				</ul>
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{note.content}
				</p>
			</div>
		</>
	)
}
