import {
	Client,
	type PlaceAutocompleteRequest,
	PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js'

const client = new Client({})

const defaultParams = {
	key: process.env.GOOGLE_PLACES_API_KEY,
}

type PlaceAutocompleteOpts = Omit<
	PlaceAutocompleteRequest['params'],
	'input' | 'sessiontoken'
>

/**
 * Use a query input string to request a list of Google Place predictions
 *
 * For more info on session token and billing, see:
 * https://googlemaps.github.io/google-maps-services-js/interfaces/PlaceAutocompleteRequest.html
 */
export async function fetchGoogleAutocompletions(
	input: string,
	sessiontoken?: string,
	options?: PlaceAutocompleteOpts,
) {
	try {
		const predictions = await client.placeAutocomplete({
			params: {
				...defaultParams,
				input,
				sessiontoken,
				types: PlaceAutocompleteType['establishment'],
				...options,
			},
		})
		return predictions.data.predictions
	} catch (error) {
		console.error('Error fetching Google autocompletions:', error)
		return []
	}
}

/**
 * Fetch place details from Google Places API
 *
 * For more info on fields available, see:
 * https://developers.google.com/maps/documentation/javascript/place-class-data-fields
 */
export async function fetchGoogleDetails(placeId: string) {
	try {
		const place = await client.placeDetails({
			params: {
				...defaultParams,
				place_id: placeId,
				fields: [
					// Unique Google Place ID
					'place_id',
					'name',
					// 'address_components',
					'formatted_address',
					// Location's display name, `null` if no name or `undefined` if not loaded yet
					// 'displayName',
					// Short summary of location used in map widget
					// 'editorialSummary',
					// Location's full address
					// 'formattedAddress',
					// Primary type, see: https://developers.google.com/maps/documentation/places/web-service/supported_types
					// 'primaryType',
					// Number rating between 1.0 and 5.0 based on reviews
					'rating',
					'types',
					'reviews',
					// Number of user ratings contributing to its total rating
					// 'userRatingCount',
					// Other types, see: https://developers.google.com/maps/documentation/places/web-service/supported_types
					// 'websiteURI',
				],
			},
		})

		return place.data.result
	} catch (error) {
		console.error('Error fetching Google details:', error)
		return null
	}
}

/**
 * Fetch place reviews from Google Places API
 */
export async function fetchGoogleReviews(placeId: string) {
	try {
		const place = await client.placeDetails({
			params: {
				...defaultParams,
				place_id: placeId,
				fields: ['reviews'],
			},
		})

		return place.data.result.reviews ?? []
	} catch (error) {
		console.error('Error fetching Google reviews:', error)
		return []
	}
}

export interface PlaceToImport {
	placeId: string
	name: string
	slug: string
}

/**
 * Places to import via Google Places API
 */
export const places: PlaceToImport[] = [
	{
		placeId: 'ChIJxTS16u0kxokR6Zmkm46J6GE',
		name: 'Tellus360',
		slug: 'tellus360',
	},
	{
		placeId: 'ChIJgf7Zv-0kxokRA0t9SZPR1e8',
		name: `Annie Bailey's Irish Public House`,
		slug: 'annie-baileys',
	},
	{
		placeId: 'ChIJZ1-7EfYkxokRFthY32G5T3M',
		name: '551 West',
		slug: '551-west',
	},
	{
		placeId: 'ChIJmWgjaIokxokR9sXalrqsP44',
		name: `Hildy's`,
		slug: 'hildys',
	},
	{
		placeId: 'ChIJd2O9rhslxokRSjNGSKvHsWA',
		name: 'The Coffin Bar',
		slug: 'coffin-bar',
	},
	{
		placeId: 'ChIJW5-ThAUlxokRXWcDsxc9T90',
		name: 'Burley Bar',
		slug: 'burley-bar',
	},
	{
		placeId: 'ChIJHbVUbvIkxokRYnG3TM2yFHc',
		name: 'The Lancaster Dispensing Company',
		slug: 'dipco',
	},
	{
		placeId: 'ChIJq4bxGdYlxokRYrLPGQCYtbM',
		name: 'Vine Bar',
		slug: 'vine-bar',
	},
	{
		placeId: 'ChIJNd55qPQkxokR6wiZ8IAgetA',
		name: 'Shamrock Cafe',
		slug: 'shamrock-cafe',
	},
	{
		placeId: 'ChIJl1efY5kkxokRXX2D7_pT2xM',
		name: 'American Bar & Grill',
		slug: 'american-bar-grill',
	},
]
