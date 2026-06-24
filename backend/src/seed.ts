import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create some products
  const products = [
    { id: 'lassi-80ml', name: 'Smoodh Lassi 80ml', price: 10 },
    { id: 'lassi-180ml', name: 'Smoodh Lassi 180ml', price: 20 },
    { id: 'chocolate-80ml', name: 'Smoodh Chocolate 80ml', price: 10 },
    { id: 'chocolate-180ml', name: 'Smoodh Chocolate 180ml', price: 20 },
    { id: 'hazelnut-80ml', name: 'Smoodh Chocolate Hazelnut 80ml', price: 10 },
    { id: 'hazelnut-180ml', name: 'Smoodh Chocolate Hazelnut 180ml', price: 20 },
    { id: 'coffee-80ml', name: 'Smoodh Coffee Frappe 80ml', price: 10 },
    { id: 'coffee-180ml', name: 'Smoodh Coffee Frappe 180ml', price: 20 },
    { id: 'kesar-80ml', name: 'Smoodh Kesar Badam 80ml', price: 10 },
    { id: 'kesar-180ml', name: 'Smoodh Kesar Badam 180ml', price: 20 },
    { id: 'toffee-80ml', name: 'Smoodh Toffee Caramel 80ml', price: 10 },
    { id: 'toffee-180ml', name: 'Smoodh Toffee Caramel 180ml', price: 20 },
    { id: 'appy-160ml', name: 'Appy Fizz 160ml', price: 10 },
    { id: 'appy-250ml', name: 'Appy Fizz 250ml', price: 20 },
    { id: 'appy-600ml', name: 'Appy Fizz 600ml', price: 40 },
    { id: 'appy-1l', name: 'Appy Fizz 1L', price: 65 },
    { id: 'bfizz-160ml', name: 'B Fizz 160ml', price: 10 },
    { id: 'bfizz-250ml', name: 'B Fizz 250ml', price: 20 },
    { id: 'bfizz-600ml', name: 'B Fizz 600ml', price: 40 },
    { id: 'frooti-125ml', name: 'Frooti 125ml', price: 10 },
    { id: 'frooti-330ml', name: 'Frooti 330ml', price: 20 },
    { id: 'frooti-1.2l', name: 'Frooti 1.2L', price: 60 },
    { id: 'frooti-2l', name: 'Frooti 2L', price: 100 },
    { id: 'friocola-250ml', name: 'Frio Cola 250ml', price: 20 },
    { id: 'friocola-600ml', name: 'Frio Cola 600ml', price: 40 },
    { id: 'friocola-1.5l', name: 'Frio Cola 1.5L', price: 80 },
    { id: 'friolime-250ml', name: 'Frio Lime 250ml', price: 20 },
    { id: 'friolime-600ml', name: 'Frio Lime 600ml', price: 40 },
    { id: 'friolime-1.5l', name: 'Frio Lime 1.5L', price: 80 },
    { id: 'frioorange-250ml', name: 'Frio Orange 250ml', price: 20 },
    { id: 'frioorange-600ml', name: 'Frio Orange 600ml', price: 40 },
    { id: 'frioorange-1.5l', name: 'Frio Orange 1.5L', price: 80 },
    { id: 'clubsoda-250ml', name: 'Bombay 99 Club Soda 250ml', price: 20 },
    { id: 'clubsoda-750ml', name: 'Bombay 99 Club Soda 750ml', price: 50 },
    { id: 'gingerale-250ml', name: 'Bombay 99 Ginger Ale 250ml', price: 20 },
    { id: 'gingerale-750ml', name: 'Bombay 99 Ginger Ale 750ml', price: 50 },
    { id: 'tonic-250ml', name: 'Bombay 99 Tonic Water 250ml', price: 20 },
    { id: 'tonic-750ml', name: 'Bombay 99 Tonic Water 750ml', price: 50 },
  ];

  for (const p of products) {
    const prod = await prisma.product.upsert({
      where: { id: p.id },
      update: { name: p.name, price: p.price },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: p.id },
      update: { quantity: 1000 },
      create: {
        productId: p.id,
        quantity: 1000,
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
