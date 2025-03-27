import { type Route } from './+types/index.ts'

export const meta: Route.MetaFunction = () => [{ title: 'MockTails' }]

export default function Index() {
	return (
		<main className="font-poppins flex h-full flex-1 flex-col items-center bg-[url(https://picsum.photos/id/192/400/800)] bg-cover bg-center bg-no-repeat px-4 py-16 md:bg-[url(https://picsum.photos/id/192/1200/800)]">
			<div className="flex max-w-md flex-col items-center rounded-2xl bg-background p-10 text-center md:p-20">
				<div className="animate-slide-top text-5xl [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-delay:0.5s] xl:[animation-fill-mode:backwards]">
					🍸🥃🍷🍹🍺
				</div>
				<h1
					data-heading
					className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
				>
					MockTails
				</h1>
				<p
					data-paragraph
					className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]"
				>
					The <strong>very real</strong> review site
					<br />
					for <strong>very fake</strong> cocktails.
				</p>
			</div>
		</main>
	)
}
