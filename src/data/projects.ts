export interface Project { id: number; title: string; desc: string; tech: string[] }
export const projects: Project[] = [
  {
    id: 1,
    title: 'Content Management System Prototype',
    desc: 'A full-featured CMS built from scratch — includes a post editor, user management, and a content publishing workflow.',
    tech: ['PHP', 'MySQL', 'HTML', 'Bootstrap', 'CSS', 'JavaScript', 'jQuery'],
  },
  {
    id: 2,
    title: 'Final Year Project - Payment Gateway Integration',
    desc: 'API integration and back-end development enabling multiple payment gateways (AmazonPay, PhonePe, GooglePay) for a food delivery platform.',
    tech: ['Ruby on Rails', 'PostgreSQL', 'AmazonPay', 'PhonePe', 'REST APIs'],
  },
  {
    id: 3,
    title: 'Image Steganography',
    desc: 'A tool to conceal secret messages within image files using pixel-level manipulation techniques for data privacy.',
    tech: ['Python', 'OpenCV', 'NumPy', 'Image Processing'],
  },
  {
    id: 4,
    title: 'Virtual Reality App - NASA Space Apps',
    desc: "Built at NASA Space Apps Hackathon — generates an immersive VR environment based on images captured by NASA's Hubble Telescope.",
    tech: ['VR', 'NASA API', 'Hubble Telescope', 'JavaScript'],
  },
  {
    id: 5,
    title: 'Smart Fish Tracking',
    desc: 'Computer vision system for detecting and tracking fish in underwater video using background subtraction, HOG features, and linear regression. Tested with Guppy fish in aquarium.',
    tech: ['Python', 'OpenCV', 'Computer Vision', 'HOG', 'Background Subtraction'],
  },
  {
    id: 6,
    title: 'Trash Out - Android App',
    desc: "Android app that finds the nearest waste bin using Dijkstra's algorithm and Google Maps API with classifications for Biodegradable, Non-Biodegradable, and Toxic waste. Awarded at Hack2Help Hackathon, DSU 2016.",
    tech: ['Android Studio', 'Java', 'Google Maps API', "Dijkstra's Algorithm", 'GPS'],
  },
];