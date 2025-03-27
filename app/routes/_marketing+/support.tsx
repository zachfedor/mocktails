import { Link } from 'react-router'
import { Button } from '#app/components/ui/button'

export default function SupportRoute() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center">
			<h1 className="pb-4 text-xl">Support</h1>

			<p className="pb-4">Read the manual.</p>

			<Button className="mb-4">
				<Link to="https://github.com/epicweb-dev/epic-stack/tree/main/docs">
					Docs
				</Link>
			</Button>

			<p className="text-xl">🙏</p>
		</div>
	)
}
