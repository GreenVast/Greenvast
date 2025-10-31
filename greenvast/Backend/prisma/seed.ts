import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const crops = ['Maize', 'Beans', 'Tea', 'Coffee', 'Avocado', 'Tomato'];
  const markets = [
    { name: 'Nairobi', county: 'Nairobi' },
    { name: 'Eldoret', county: 'Uasin Gishu' },
    { name: 'Kisumu', county: 'Kisumu' },
    { name: 'Kericho', county: 'Kericho' },
    { name: 'Mombasa', county: 'Mombasa' },
    { name: 'Nyeri', county: 'Nyeri' },
    { name: 'Nakuru', county: 'Nakuru' },
    { name: 'Kitale', county: 'Trans Nzoia' },
  ];
  const counties = ['Kericho', 'Nakuru', 'Kitui', 'Kiambu', 'Narok'];

  for (const market of markets) {
    await prisma.market.upsert({
      where: { name: market.name },
      update: { county: market.county },
      create: {
        name: market.name,
        county: market.county,
      },
    });
  }

  for (const crop of crops) {
    for (const county of counties) {
      await prisma.community.upsert({
        where: {
          crop_county: {
            crop,
            county,
          },
        },
        update: {},
        create: {
          crop,
          county,
          name: `${crop} - ${county}`,
          description: `Updates and tips for ${crop.toLowerCase()} farmers in ${county}.`,
        },
      });
    }
  }

  const demoUser = await prisma.user.upsert({
    where: { firebaseUid: 'demo-farmer' },
    update: {},
    create: {
      firebaseUid: 'demo-farmer',
      role: UserRole.FARMER,
      phoneNumber: '+254700000000',
      profile: {
        create: {
          name: 'Demo Farmer',
          county: 'Kericho',
          language: 'en',
        },
      },
      farms: {
        create: [
          {
            name: 'Green Acres',
            county: 'Kericho',
            sizeAcres: 3,
            crops: {
              create: [
                {
                  crop: 'Maize',
                  expectedYield: 2400,
                  yieldUnit: 'kg',
                },
              ],
            },
            livestock: {
              create: [
                {
                  type: 'Dairy Cows',
                  count: 8,
                },
              ],
            },
            parcels: {
              create: [
                {
                  name: 'Block A',
                  areaAcres: 3,
                  cropType: 'Maize',
                  soilType: 'Loam',
                },
              ],
            },
            inventoryLots: {
              create: [
                {
                  crop: 'Maize',
                  quantity: 500,
                  unit: 'kg',
                  pricePerUnit: 45,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const priceSnapshots = [
    {
      commodity: 'Maize',
      market: 'Nairobi',
      unit: '90kg bag',
      date: new Date('2024-08-05'),
      medianPrice: 5200,
      avgPrice: 5250,
      minPrice: 5000,
      maxPrice: 5450,
    },
    {
      commodity: 'Maize',
      market: 'Nairobi',
      unit: '90kg bag',
      date: new Date('2024-08-12'),
      medianPrice: 5340,
      avgPrice: 5360,
      minPrice: 5200,
      maxPrice: 5520,
    },
    {
      commodity: 'Beans',
      market: 'Eldoret',
      unit: '90kg bag',
      date: new Date('2024-08-12'),
      medianPrice: 7200,
      avgPrice: 7150,
      minPrice: 7000,
      maxPrice: 7400,
    },
    {
      commodity: 'Tomato',
      market: 'Nakuru',
      unit: 'crate',
      date: new Date('2024-08-12'),
      medianPrice: 1500,
      avgPrice: 1480,
      minPrice: 1400,
      maxPrice: 1600,
    },
  ];

  for (const snapshot of priceSnapshots) {
    const market = await prisma.market.findUnique({
      where: { name: snapshot.market },
    });
    if (!market) continue;
    const optionalFields = {
      ...(snapshot.avgPrice !== undefined ? { avgPrice: snapshot.avgPrice } : {}),
      ...(snapshot.minPrice !== undefined ? { minPrice: snapshot.minPrice } : {}),
      ...(snapshot.maxPrice !== undefined ? { maxPrice: snapshot.maxPrice } : {}),
    };
    await prisma.priceSnapshot.upsert({
      where: {
        commodity_marketId_date: {
          commodity: snapshot.commodity,
          marketId: market.id,
          date: snapshot.date,
        },
      },
      update: {
        medianPrice: snapshot.medianPrice,
        unit: snapshot.unit,
        ...optionalFields,
      },
      create: {
        commodity: snapshot.commodity,
        marketId: market.id,
        date: snapshot.date,
        unit: snapshot.unit,
        medianPrice: snapshot.medianPrice,
        ...optionalFields,
      },
    });
  }

  const demoFarm = await prisma.farm.findFirst({
    where: { userId: demoUser.id },
    include: { parcels: true },
  });

  if (demoFarm) {
    const parcel = demoFarm.parcels[0];
    const yieldEntries = [
      {
        type: 'Crop',
        crop: 'Maize',
        season: 'LR24',
        quantity: 2400,
        unit: 'kg',
        date: new Date('2024-06-30'),
        parcelId: parcel?.id,
      },
      {
        type: 'Crop',
        crop: 'Maize',
        season: 'SR23',
        quantity: 2100,
        unit: 'kg',
        date: new Date('2023-11-20'),
        parcelId: parcel?.id,
      },
      {
        type: 'Milk',
        crop: null,
        season: '2024',
        quantity: 5400,
        unit: 'litre',
        date: new Date('2024-03-31'),
        parcelId: null,
      },
    ];

    for (const entry of yieldEntries) {
      await prisma.yieldHistory.upsert({
        where: {
          farmId_date: {
            farmId: demoFarm.id,
            date: entry.date,
          },
        },
        update: {
          quantity: entry.quantity,
          unit: entry.unit,
          crop: entry.crop ?? undefined,
          season: entry.season ?? undefined,
          parcelId: entry.parcelId ?? undefined,
        },
        create: {
          farmId: demoFarm.id,
          parcelId: entry.parcelId ?? undefined,
          type: entry.type,
          crop: entry.crop ?? undefined,
          season: entry.season ?? undefined,
          quantity: entry.quantity,
          unit: entry.unit,
          date: entry.date,
        },
      });
    }
  }

  console.log('Seed data ready. Demo user id:', demoUser.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
