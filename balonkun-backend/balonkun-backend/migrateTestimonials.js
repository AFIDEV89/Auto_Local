import storeDb from "./src/database/storeDb.js";
import { TestimonialModel } from "./src/modules/testimonials/TestimonialModel.js";

const mockData = {
    carOwners: [
        {
            description: "The fit and finish of the seat covers I bought for my Creta are absolutely phenomenal. It feels like a completely different, much more expensive car inside now.",
            clientName: "Rahul Sharma",
            role: "Hyundai Creta Owner",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            description: "I was skeptical about ordering online, but the vehicle finder tool was spot on. The floor mats fit perfectly and the quality is top-notch. Highly recommended!",
            clientName: "Priya Singh",
            role: "Honda City Owner",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            description: "Excellent service from the dealer network. I located a store nearby, went there, and they installed everything in 2 hours. Very professional staff.",
            clientName: "Vikram Malhotra",
            role: "Tata Harrier Owner",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/85.jpg"
        },
        {
            description: "Autoform's premium leatherette feels better than the original upholstery. The contrast stitching matches my car's interior perfectly. Worth every penny.",
            clientName: "Ananya Iyer",
            role: "Kia Seltos Owner",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        {
            description: "Bought the customized steering cover and 7D mats. The installation was seamless and the grip on the steering feels great. Definitely a premium upgrade.",
            clientName: "Arjun Reddy",
            role: "Mahindra XUV700 Owner",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/22.jpg"
        }
    ],
    franchisePartners: [
        {
            description: "Partnering with Autoform has been the best decision for my business. The product quality and support are unmatched in the industry.",
            clientName: "Rajiv Mehta",
            role: "Franchise Partner, Delhi",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/41.jpg"
        },
        {
            description: "The brand reputation and customer demand for Autoform products make it a highly profitable franchise opportunity.",
            clientName: "Sanjay Gupta",
            role: "Franchise Partner, Mumbai",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/62.jpg"
        },
        {
            description: "Exceptional training and marketing support from the corporate team. They truly care about the success of their partners.",
            clientName: "Anil Kapoor",
            role: "Franchise Partner, Bangalore",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/55.jpg"
        },
        {
            description: "The inventory management system provided by Autoform makes it easy to track orders and serve customers efficiently. It's a very organized brand.",
            clientName: "Meera Das",
            role: "Franchise Partner, Kolkata",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/29.jpg"
        },
        {
            description: "Adding Autoform accessories to my showroom increased footfall significantly. The brand's focus on 'Perfect Fit' sells the product itself.",
            clientName: "Vikas Verma",
            role: "Franchise Partner, Pune",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/33.jpg"
        }
    ]
};

async function migrateTestimonials() {
    console.log("Starting Testimonials Migration...");
    
    try {
        // Wait 3 seconds for the implicit sync in storeDb.js to complete before running our code
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const Testimonial = storeDb.testimonials;
        
        // Clear existing data for a fresh migration (safe for this specific isolated use case)
        console.log("Cleaning up existing testimonials...");
        await Testimonial.destroy({ where: {}, truncate: true });

        const dataToInsert = [
            ...mockData.carOwners.map(item => ({ ...item, type: 'carOwners', status: 'Active' })),
            ...mockData.franchisePartners.map(item => ({ ...item, type: 'franchisePartners', status: 'Active' }))
        ];

        await Testimonial.bulkCreate(dataToInsert);
        
        console.log("Successfully migrated 10 testimonials to the database!");
        process.exit(0);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateTestimonials();
