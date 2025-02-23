import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default inbox space
  await prisma.space.upsert({
    where: { name: 'inbox' },
    update: {},
    create: {
      id: 'inbox', // Use 'inbox' as the ID for easy reference
      name: 'inbox',
      description: 'Default space for new notes',
      icon: '📥',
      color: '#94A3B8'
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 