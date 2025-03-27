import { faker } from '@faker-js/faker'
import { createCocktailList } from '#app/utils/ai.server'
import { prisma } from '#app/utils/db.server.ts'
import { MOCK_CODE_GITHUB } from '#app/utils/providers/constants'
import {
	createPassword,
	createPlace,
	createUser,
	getNoteImages,
	getUserImages,
} from '#tests/db-utils.ts'
import { insertGitHubUser } from '#tests/mocks/github.ts'
import { places } from '#tests/mocks/places.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	const totalPlaces = places.length
	const placeIds = []
	console.time(`🍸 Created ${totalPlaces} bars...`)

	for (const placeToImport of places) {
		const placeData = await createPlace(placeToImport)

		const place = await prisma.place.create({ data: placeData })
		placeIds.push(place.id)

		console.time(`🥃 Created cocktails for ${place.name}`)
		// const cocktails = [];
		const cocktails = await createCocktailList(placeData)

		for (const cocktail of cocktails) {
			await prisma.cocktail.create({
				data: {
					...cocktail,
					placeId: place.id,
				},
			})
		}
		console.timeEnd(`🥃 Created cocktails for ${place.name}`)
	}

	console.timeEnd(`🍸 Created ${totalPlaces} bars...`)

	const totalUsers = 5
	console.time(`👤 Created ${totalUsers} users...`)
	const noteImages = await getNoteImages()
	const userImages = await getUserImages()

	for (let index = 0; index < totalUsers; index++) {
		const userData = createUser()
		const user = await prisma.user.create({
			select: { id: true },
			data: {
				...userData,
				password: { create: createPassword(userData.username) },
				roles: { connect: { name: 'user' } },
			},
		})

		// Upload user profile image
		const userImage = userImages[index % userImages.length]
		if (userImage) {
			await prisma.userImage.create({
				data: {
					userId: user.id,
					objectKey: userImage.objectKey,
				},
			})
		}

		// Create notes with images
		const notesCount = faker.number.int({ min: 1, max: 3 })
		for (let noteIndex = 0; noteIndex < notesCount; noteIndex++) {
			const note = await prisma.note.create({
				select: { id: true },
				data: {
					title: faker.lorem.sentence(),
					content: faker.lorem.paragraphs(),
					ownerId: user.id,
					placeId: faker.helpers.arrayElement(placeIds),
				},
			})

			// Add images to note
			const noteImageCount = faker.number.int({ min: 1, max: 3 })
			for (let imageIndex = 0; imageIndex < noteImageCount; imageIndex++) {
				const imgNumber = faker.number.int({ min: 0, max: 9 })
				const noteImage = noteImages[imgNumber]
				if (noteImage) {
					await prisma.noteImage.create({
						data: {
							noteId: note.id,
							altText: noteImage.altText,
							objectKey: noteImage.objectKey,
						},
					})
				}
			}
		}
	}
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(`🐨 Created admin user "zach"`)

	const githubUser = await insertGitHubUser(MOCK_CODE_GITHUB)

	const zach = await prisma.user.create({
		select: { id: true },
		data: {
			email: 'zach@example.com',
			username: 'zach',
			name: 'Zach',
			password: { create: createPassword('mocktails') },
			connections: {
				create: {
					providerName: 'github',
					providerId: String(githubUser.profile.id),
				},
			},
			roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
		},
	})

	await prisma.userImage.create({
		data: {
			userId: zach.id,
			objectKey: 'user/zach.jpg',
		},
	})
	console.timeEnd(`🐨 Created admin user "zach"`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

// we're ok to import from the test directory in this file
/*
eslint
	no-restricted-imports: "off",
*/
