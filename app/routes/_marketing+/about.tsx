import { Img } from 'openimg/react'

export default function AboutRoute() {
	return (
		<div>
			<h1>About page</h1>
			<Img
				src="https://picsum.photos/id/192/400/300"
				alt="Grayscale photo of quiet bar scene"
				width={400}
				height={300}
			/>
		</div>
	)
}
