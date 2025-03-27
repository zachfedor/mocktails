import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { UniqueEnforcer } from 'enforce-unique'
import { fetchGoogleDetails } from '#app/utils/googlePlaces.server.ts'
import { type PlaceToImport } from '#tests/mocks/places.ts'

export async function createPlace({ placeId, ...rest }: PlaceToImport) {
	const googleData = await fetchGoogleDetails(placeId)

	return {
		...rest,
		address: googleData?.formatted_address ?? '',
		hours: generateHours(),
	}
}

Prisma

// Generate operating hours
function generateHours() {
	const days = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	] as const

	return days.reduce(
		(acc, day) => {
			const isClosed = day === 'Monday' && faker.datatype.boolean(0.4)

			let hours: string
			if (isClosed) {
				hours = 'Closed'
			} else {
				const isWeekend = day === 'Friday' || day === 'Saturday'
				const openHour = isWeekend ? '16:00' : '17:00'
				const closeHour = isWeekend ? '02:00' : '00:00'
				hours = `${openHour} - ${closeHour}`
			}

			return { ...acc, [day]: hours }
		},
		{} as Record<keyof typeof days, string>,
	)
}

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.username({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')

	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}

let noteImages: Array<{ altText: string; objectKey: string }> | undefined
export async function getNoteImages() {
	if (noteImages) return noteImages

	noteImages = await Promise.all([
		{
			altText:
				'hawaiian punch, blue curaçao, and an unhealthy amount of blue dye #1',
			objectKey: 'notes/blue.jpg',
		},
		{
			altText: 'cheers to the frickin weekend',
			objectKey: 'notes/cheers.jpg',
		},
		{
			altText: 'eggnog has alcohol in it, right?',
			objectKey: 'notes/eggnog.jpg',
		},
		{
			altText: 'a classic gin and tonic',
			objectKey: 'notes/gin.jpg',
		},
		{
			altText: 'flowers are for gardens, not drinks',
			objectKey: 'notes/hibiscus.jpg',
		},
		{
			altText: 'mojitos are the bestitos',
			objectKey: 'notes/mojito.jpg',
		},
		{
			altText: 'mules of the moscow variety',
			objectKey: 'notes/mules.jpg',
		},
		{
			altText: 'and you thought gin tasted like a pine tree',
			objectKey: 'notes/rosemary.jpg',
		},
		{
			altText: "i don't know what sazerac means, but dang is it tasty",
			objectKey: 'notes/sazerac.jpg',
		},
		{
			altText: `did you skip breakfast? cause it has egg whites in it`,
			objectKey: 'notes/sour.jpg',
		},
		{
			altText: `afternoon tea was never so exciting`,
			objectKey: 'notes/twistedtea.jpg',
		},
		{
			altText: `dark and smokey, like a crappy diner`,
			objectKey: 'notes/whiskey.jpg',
		},
	])

	return noteImages
}

let userImages: Array<{ objectKey: string }> | undefined
export async function getUserImages() {
	if (userImages) return userImages

	userImages = await Promise.all(
		Array.from({ length: 10 }, (_, index) => ({
			objectKey: `user/${index}.jpg`,
		})),
	)

	return userImages
}
