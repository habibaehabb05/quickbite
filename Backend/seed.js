const mongoose = require('mongoose');
const Restaurant = require('./Models/restaurant');
const Menu = require('./Models/Menu');

const MONGO_URI = 'mongodb://localhost:27017/quickbite';

async function seed() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Seed Restaurants
    const restaurants = await Restaurant.insertMany([
        {
            name: 'Gyros',
            slug: 'gyros',
            tagline: 'Delicious Mediterranean Food',
            description: 'Order delicious gyros, burgers, and authentic Mediterranean dishes',
            keywords: ['gyros', 'mediterranean', 'burgers'],
            about: 'Best gyros in town!',
            phone: '123456789',
            email: 'gyros@example.com',
            address: '123 Gyros St',
            hours: ['Mon-Sun: 10am-10pm'],
            social: { instagram: '#', facebook: '#', twitter: '#', whatsapp: '#' },
            currency: 'EGP'
        },
        {
            name: 'My Corner',
            slug: 'mycorner',
            tagline: 'Tasty Meals for Every Taste',
            description: 'Order delicious meals, burgers, and authentic dishes from My Corner Restaurant.',
            keywords: ['mycorner', 'meals', 'burgers', 'sandwiches'],
            about: 'Your favorite corner for food!',
            phone: '987654321',
            email: 'mycorner@example.com',
            address: '456 Corner Ave',
            hours: ['Mon-Sun: 9am-11pm'],
            social: { instagram: '#', facebook: '#', twitter: '#', whatsapp: '#' },
            currency: 'EGP'
        },
        {
            name: 'Cinnabon',
            slug: 'cinnabon',
            tagline: 'Delicious Sweet Treats',
            description: 'Order delicious cinnamon rolls, pastries, and sweet treats',
            keywords: ['cinnabon', 'cinnamon rolls', 'pastries', 'desserts', 'sweet treats'],
            about: 'Baking the world\'s best cinnamon rolls since 1985...',
            phone: '555123456',
            email: 'cinnabon@example.com',
            address: '789 Sweet Blvd',
            hours: ['Mon-Sun: 8am-12am'],
            social: { instagram: '#', facebook: '#', twitter: '#', whatsapp: '#' },
            currency: 'EGP'
        }
    ]);

    // Seed Menus (full menu for each)
    await Menu.insertMany([
        {
            restaurant: restaurants[0]._id,
            items: [
                // Gyros - Burgers
                {
                    name: 'Gyro Burger',
                    description: 'Gyro meat, Tzatziki, Onions, Tomatoes, Pita bread',
                    price: 130,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Classic Beef Burger',
                    description: 'Beef patty, Lettuce, Tomato, Cheese, Bun',
                    price: 120,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Chicken Burger',
                    description: 'Grilled chicken, Lettuce, Tomato, Mayo, Bun',
                    price: 110,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
                },
                // Gyros - Dishes
                {
                    name: 'Hummus Plate',
                    description: 'Homemade hummus, Olive oil, Pita bread',
                    price: 60,
                    category: 'Dishes',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1MmvkJRRa2ohY05YkOdRKRxpL1SIkDKzt6g&s'
                },
                {
                    name: 'Falafel Plate',
                    description: 'Falafel, Salad, Tahini, Pita bread',
                    price: 55,
                    category: 'Dishes',
                    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Greek Salad',
                    description: 'Tomatoes, Cucumber, Feta cheese, Olives, Olive oil',
                    price: 70,
                    category: 'Dishes',
                    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                },
                // Gyros - Sandwiches
                {
                    name: 'Falafel Wrap',
                    description: 'Falafel, Lettuce, Tomato, Tahini sauce, Pita bread',
                    price: 50,
                    category: 'Sandwiches',
                    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Chicken Shawarma Wrap',
                    description: 'Chicken, Garlic sauce, Pickles, Pita bread',
                    price: 65,
                    category: 'Sandwiches',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        {
            restaurant: restaurants[1]._id,
            items: [
                // My Corner - Burgers
                {
                    name: 'Classic Burger',
                    description: 'Beef patty, Lettuce, Tomato, Cheese, Bun',
                    price: 120,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Chicken Burger',
                    description: 'Grilled chicken, Lettuce, Tomato, Mayo, Bun',
                    price: 100,
                    category: 'Burgers',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
                },
                // My Corner - Sandwiches
                {
                    name: 'Chicken Sandwich',
                    description: 'Grilled chicken, Lettuce, Mayo, Bun',
                    price: 90,
                    category: 'Sandwiches',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Tuna Sandwich',
                    description: 'Tuna, Lettuce, Tomato, Mayo, Bun',
                    price: 85,
                    category: 'Sandwiches',
                    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                },
                // My Corner - Pancakes
                {
                    name: 'Pancake Stack',
                    description: 'Fluffy pancakes, Maple syrup, Butter',
                    price: 70,
                    category: 'Pancakes',
                    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Chocolate Pancakes',
                    description: 'Pancakes, Chocolate sauce, Whipped cream',
                    price: 80,
                    category: 'Pancakes',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                },
                // My Corner - Drinks
                {
                    name: 'Fresh Orange Juice',
                    description: 'Freshly squeezed orange juice',
                    price: 30,
                    category: 'Drinks',
                    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Iced Coffee',
                    description: 'Chilled coffee, Ice, Milk',
                    price: 35,
                    category: 'Drinks',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        {
            restaurant: restaurants[2]._id,
            items: [
                // Cinnabon - Classics
                {
                    name: 'Classic Cinnabon Roll',
                    description: 'Warm dough, Cinnamon, Signature frosting',
                    price: 70,
                    category: 'Classics',
                    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'MiniBon',
                    description: 'Mini version of the classic Cinnabon roll',
                    price: 40,
                    category: 'Classics',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                },
                // Cinnabon - Specialties
                {
                    name: 'Caramel Pecanbon',
                    description: 'Cinnabon roll, Caramel, Pecans',
                    price: 85,
                    category: 'Specialties',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'ChocoBon',
                    description: 'Cinnabon roll, Chocolate sauce',
                    price: 80,
                    category: 'Specialties',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                },
                // Cinnabon - Drinks
                {
                    name: 'MochaLatte Chill',
                    description: 'Iced blended coffee with chocolate and cinnamon',
                    price: 55,
                    category: 'Drinks',
                    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: 'Classic Lemonade',
                    description: 'Fresh lemonade, Ice',
                    price: 30,
                    category: 'Drinks',
                    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80'
                }
            ]
        }
    ]);

    console.log('Database seeded!');
    mongoose.disconnect();
}

seed().catch(err => {
    console.error('Seeding error:', err);
    mongoose.disconnect();
});