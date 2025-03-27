import 'dotenv/config'
import { invariant } from '@epic-web/invariant'
import { createCocktailList } from '#app/utils/ai.server'
import { init, getEnv } from '#app/utils/env.server.ts'
import { fetchGoogleDetails, places } from '#app/utils/googlePlaces.server.ts'

init()
global.ENV = getEnv()

async function main() {
	const place = places![0]
	invariant(place, 'There is no place data in fixtures')

	console.log(`fetching details for ${place.name}`)
	const details = await fetchGoogleDetails(place.placeId)
	invariant(details, 'Could not find place details')
	console.log(`success! google reviews: ${details.reviews?.length}`)

	console.log(`creating cocktail list...`)
	const cocktails = await createCocktailList(details)

	console.log(JSON.stringify(cocktails, null, 2))
}

main().catch((e) => {
	console.error('Error running search script:', e)
	process.exit(1)
})
