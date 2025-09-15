require("dotenv").config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

const userId = "68c5c2cf587150d74394acbd"; // Substitua pelo _id desejado

const properties = [
  {
    title: "Modern Downtown Apartment",
    description: "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Perfect for business travelers and digital nomads.",
    address: {
      street: "Main Street",
      number: "123",
      neighborhood: "Downtown",
      city: "San Francisco",
      zipCode: "94102"
    },
    nightlyRate: 150,
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    amenities: ["WiFi", "Kitchen", "Parking", "Air Conditioning", "Gym"],
    status: "published",
    blockedDates: [new Date("2024-12-25"), new Date("2024-12-26")],
    ownerId: userId
  },
  {
    title: "Cozy Studio Near Beach",
    description: "Charming studio apartment just 2 blocks from the beach. Fully furnished with everything you need for a comfortable stay.",
    address: {
      street: "Ocean Avenue",
      number: "456",
      neighborhood: "Sunset District",
      city: "San Francisco",
      zipCode: "94122"
    },
    nightlyRate: 95,
    photos: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    amenities: ["WiFi", "Kitchen", "Beach Access", "Pet Friendly"],
    status: "published",
    blockedDates: [],
    ownerId: userId
  }
];

async function seedDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in .env file.');
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    await Property.deleteMany();
    const insertedProperties = await Property.insertMany(properties);
    console.log('Properties seeded:', insertedProperties.map(p => ({ id: p._id, title: p.title })));
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();