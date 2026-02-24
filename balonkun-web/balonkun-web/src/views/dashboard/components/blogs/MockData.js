import { blogOneImg, blogTwoImg, blogThreeImg } from '@assets/images';

export default [
  {
    id: 1,
    image: blogOneImg,
    name: "admin",
    date: new Date(),
    title: "Confused About Buying Seat Covers",
    description: "Car seat coverings are one of the most confusing interior car accessories to choose for drivers"
  },
  {
    id: 2,
    image: blogTwoImg,
    name: "admin",
    date: new Date(),
    title: "Why Would You Need Car Seat Covers",
    description: "Seat covers are one such add-on. Let's talk about how important car seat coverings are today!",
    isHighlight: true
  },
  {
    id: 3,
    image: blogThreeImg,
    name: "admin",
    date: new Date(),
    title: "Types of Car Seat Covers",
    description: "The correct set of seat covers can completely transform the interior of your car",
  }
]
