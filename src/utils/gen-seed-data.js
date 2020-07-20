import faker from 'faker'
import fs from 'fs'

function generateSeedData() {
  const userId1 = faker.random.uuid()
  const userId2 = faker.random.uuid()

  const usersQuery = `
  INSERT INTO public.users ("id", "name", "surname", "email", "password") VALUES
    ('${userId1}', 'User', 'Cero', 'user@gmail.com', '$2b$10$ov3LfBl1HMISvGUbVCc6VuKAXXfMzuVsNYC2/QIetpEvEyyv6DZUm'),
    ('${userId2}', 'User', 'One', 'user1@gmail.com', '$2b$10$ov3LfBl1HMISvGUbVCc6VuKAXXfMzuVsNYC2/QIetpEvEyyv6DZUm');
  `

  const categoriesName = ['Tech', 'Networking', 'Data', 'Marketing', 'Self', 'Fit']
  const categories = categoriesName.map((name) => ({
    id: faker.random.uuid(),
    title: name
  }))

  const categoriesQuery = `
  INSERT INTO public.categories ("id", "title")
    VALUES ${categories.map((category) => `('${category.id}','${category.title}')`).join(',')};
  `

  const schools = Array.from({ length: 10 }).map(() => {
    return {
      id: faker.random.uuid(),
      title: faker.company.companyName()
    }
  })

  const schoolsQuery = `
  INSERT INTO public.schools ("id", "title")
    VALUES ${schools.map((school) => `('${school.id}','${school.title}')`).join(',')};
  `

  const lessons = Array.from({ length: 20 }).map(() => {
    return {
      id: faker.random.uuid(),
      title: faker.company.companyName(),
      description: faker.lorem.paragraph(),
      school: faker.random.arrayElement(schools).id
    }
  })

  const lessonsQuery = `
  INSERT INTO public.school_lessons ("id", "title", "description", "school")
    VALUES ${lessons
      .map(
        (lesson) => `('${lesson.id}','${lesson.title}','${lesson.description}','${lesson.school}')`
      )
      .join(',')};
  `

  const userLessons = Array.from({ length: 20 }).map((_, i) => {
    return {
      id: faker.random.uuid(),
      lesson: faker.random.arrayElement(lessons).id,
      user: i % 2 === 0 ? userId2 : userId1
    }
  })

  const userLessonsQuery = `
  INSERT INTO public.user_school_lessons ("id", "user", "lesson")
    VALUES ${userLessons
      .map((lesson) => `('${lesson.id}','${lesson.user}','${lesson.lesson}')`)
      .join(',')};
  `

  const lessonCategories = Array.from({ length: 50 }).map(() => {
    return {
      id: faker.random.uuid(),
      category: faker.random.arrayElement(categories).id,
      lesson: faker.random.arrayElement(lessons).id
    }
  })

  const lessonCategoriesQuery = `
  INSERT INTO public.lesson_categories ("id", "category", "lesson")
    VALUES ${lessonCategories
      .map((lesson) => `('${lesson.id}','${lesson.category}','${lesson.lesson}')`)
      .join(',')};
  `

  fs.writeFileSync(
    'db.sql',
    `${usersQuery}
    ${categoriesQuery}
    ${schoolsQuery}
    ${lessonsQuery}
    ${userLessonsQuery}
    ${lessonCategoriesQuery}`
  )
}

generateSeedData()
