import { prisma } from "../infrastructure/database/prisma/client.js";

import { PrismaUserRepository } from "../infrastructure/database/prisma/prisma-user.repository.js";

const userRepository = new PrismaUserRepository(prisma);

async function main() {
  // 1. Yeni kullanıcı oluştur
  const newUser = await userRepository.create({
    email: "burak@example.com",
    firstName: "Burak",
    lastName: "Kucukali",
  });

  console.log("Created user:", newUser);
  console.log("Full name:", newUser.fullName);

  // 2. ID üzerinden kullanıcı bul
  const foundUser = await userRepository.findById(newUser.id);

  console.log("Found user:", foundUser);

  // 3. E-posta üzerinden kullanıcı bul
  const emailUser = await userRepository.findByEmail(
    "burak@example.com",
  );

  console.log("Found by email:", emailUser);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });