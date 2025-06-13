const mongoose = require('mongoose');
const Restaurant = require('./Models/Restaurant');
const Menu = require('./Models/menu');

const MONGO_URI = 'mongodb://localhost:27017/quickbite';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Restaurant.deleteMany({});
        await Menu.deleteMany({});
        console.log('Cleared existing data');

        // Add restaurants
        const restaurants = await Restaurant.insertMany([
            {
                name: 'Gyros',
                slug: 'gyros',
                tagline: 'Fresh Mediterranean Food',
                description: 'Delicious Mediterranean cuisine with fresh ingredients',
                keywords: ['mediterranean', 'gyros', 'healthy'],
                about: 'We serve authentic Mediterranean food with fresh ingredients',
                phone: '+20 123 456 7890',
                email: 'info@gyros.com',
                address: 'MIU Campus, Food Court',
                hours: ['Monday - Friday: 9:00 AM - 10:00 PM', 'Saturday - Sunday: 10:00 AM - 9:00 PM'],
                social: {
                    instagram: 'https://instagram.com/gyros',
                    facebook: 'https://facebook.com/gyros'
                },
                currency: 'EGP',
                status: 'open',
                rating: 4.5,
                reviewCount: 120
            },
            {
                name: 'My Corner',
                slug: 'mycorner',
                tagline: 'Your Comfort Food Corner',
                description: 'Comfort food and international cuisine',
                keywords: ['comfort food', 'burgers', 'pasta'],
                about: 'Your go-to place for comfort food on campus',
                phone: '+20 123 456 7891',
                email: 'hello@mycorner.com',
                address: 'MIU Campus, Building B',
                hours: ['Monday - Friday: 8:00 AM - 11:00 PM', 'Saturday - Sunday: 9:00 AM - 11:00 PM'],
                social: {
                    instagram: 'https://instagram.com/mycorner',
                    facebook: 'https://facebook.com/mycorner'
                },
                currency: 'EGP',
                status: 'open',
                rating: 4.2,
                reviewCount: 85
            },
            {
                name: 'Cinnabon',
                slug: 'cinnabon',
                tagline: 'Irresistible Cinnamon Treats',
                description: 'World-famous cinnamon rolls and sweet treats',
                keywords: ['cinnamon rolls', 'desserts', 'sweet'],
                about: 'Famous for our signature cinnamon rolls',
                phone: '+20 123 456 7892',
                email: 'orders@cinnabon.com',
                address: 'MIU Campus, Student Center',
                hours: ['Monday - Thursday: 7:00 AM - 10:00 PM', 'Friday - Saturday: 7:00 AM - 11:00 PM'],
                social: {
                    instagram: 'https://instagram.com/cinnabon',
                    facebook: 'https://facebook.com/cinnabon'
                },
                currency: 'EGP',
                status: 'open',
                rating: 4.7,
                reviewCount: 150
            }
        ]);

        // Add menus
        await Menu.insertMany([
            {
                restaurant: restaurants[0]._id, // Gyros
                items: [
                    {
                        name: 'Grilled Chicken',
                        description: 'Shish - Basmati rice - Pita bread - Fries - Sauce',
                        price: 140,
                        category: 'Meals',
                        image: '/images/grilled-chicken.jpg',
                        available: true
                    },
                    {
                        name: 'Classic Burger',
                        description: 'Beef patty - Cheese - Lettuce - Tomato - Special sauce',
                        price: 120,
                        category: 'Burgers',
                        image: '/images/classic-burger.jpg',
                        available: true
                    },
                    {
                        name: 'Hummus Plate',
                        description: 'Homemade hummus - Olive oil - Pita bread',
                        price: 60,
                        category: 'Dishes',
                        image: '/images/hummus.jpg',
                        available: true
                    }
                ]
            },
            {
                restaurant: restaurants[1]._id, // My Corner
                items: [
                    {
                        name: 'Corner Burger',
                        description: 'Juicy beef patty with cheese and special sauce',
                        price: 75,
                        category: 'Burgers',
                        image: '/images/corner-burger.jpg',
                        available: true
                    },
                    {
                        name: 'Chicken Pasta',
                        description: 'Creamy pasta with grilled chicken',
                        price: 90,
                        category: 'Pasta',
                        image: '/images/chicken-pasta.jpg',
                        available: true
                    }
                ]
            },
            {
                restaurant: restaurants[2]._id, // Cinnabon
                items: [
                    {
                        name: 'Classic Cinnabon Roll',
                        description: 'Our world-famous cinnamon roll with cream cheese frosting',
                        price: 45,
                        category: 'Classics',
                        image: '/images/classic-roll.jpg',
                        available: true
                    },
                    {
                        name: 'Minibon 4-Pack',
                        description: 'Four bite-sized cinnamon rolls',
                        price: 35,
                        category: 'Classics',
                        image: '/images/minibon.jpg',
                        available: true
                    }
                ]
            }
        ]);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
    }
};

if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;