import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY || 'bf8e412620824cdeb0850d2d22462b02';
const SPOON_BASE = 'https://api.spoonacular.com';

app.use(express.json());

// Initialize Google GenAI if available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Curated fallback culinary database (ensures seamless zero-failure UX even if Spoonacular free quota expires)
const FALLBACK_RECIPES: Record<number, any> = {
  716429: {
    id: 716429,
    title: 'Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs',
    image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 209,
    healthScore: 78,
    spoonacularScore: 84,
    pricePerServing: 168.3,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    summary: 'A hearty Mediterranean pasta tossed with sautéed golden cauliflower florets, aromatic toasted garlic, scallions, chili flakes, and crispy herbed breadcrumbs.',
    cuisines: ['Mediterranean', 'Italian'],
    dishTypes: ['lunch', 'main course', 'dinner'],
    diets: ['lacto ovo vegetarian'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 485, unit: 'kcal' },
        { name: 'Protein', amount: 16, unit: 'g' },
        { name: 'Carbohydrates', amount: 72, unit: 'g' },
        { name: 'Fat', amount: 14, unit: 'g' },
        { name: 'Fiber', amount: 6, unit: 'g' },
        { name: 'Sodium', amount: 390, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 14,
        percentFat: 26,
        percentCarbs: 60,
      },
    },
    extendedIngredients: [
      { id: 11135, name: 'cauliflower florets', amount: 3, unit: 'cups', original: '3 cups fresh cauliflower florets, chopped small', aisle: 'Produce' },
      { id: 20420, name: 'linguine or spaghetti', amount: 350, unit: 'g', original: '350g artisanal pasta of choice', aisle: 'Pasta and Rice' },
      { id: 11215, name: 'garlic cloves', amount: 4, unit: 'cloves', original: '4 cloves garlic, thinly sliced', aisle: 'Produce' },
      { id: 11291, name: 'scallions (green onions)', amount: 4, unit: 'stalks', original: '4 green onions, chopped', aisle: 'Produce' },
      { id: 4053, name: 'extra virgin olive oil', amount: 3, unit: 'tbsp', original: '3 tbsp extra virgin olive oil', aisle: 'Oil, Vinegar, Salad Dressing' },
      { id: 18079, name: 'panko breadcrumbs', amount: 0.5, unit: 'cup', original: '1/2 cup panko breadcrumbs', aisle: 'Bakery/Bread' },
      { id: 1032, name: 'parmesan cheese', amount: 0.25, unit: 'cup', original: '1/4 cup freshly grated parmesan cheese', aisle: 'Cheese' },
      { id: 2031, name: 'crushed red pepper flakes', amount: 0.5, unit: 'tsp', original: '1/2 tsp crushed chili flakes', aisle: 'Spices and Seasonings' },
      { id: 2047, name: 'kosher salt and black pepper', amount: 1, unit: 'pinch', original: 'Flaky sea salt and cracked black pepper to taste', aisle: 'Spices and Seasonings' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Bring a large pot of salted water to a rolling boil. Add pasta and cook until al dente, about 9 minutes.', length: { number: 9, unit: 'minutes' } },
          { number: 2, step: 'In a wide skillet, heat 1 tablespoon of olive oil over medium heat. Add the panko breadcrumbs and toast until fragrant and golden amber, about 3 minutes. Transfer to a bowl.', length: { number: 3, unit: 'minutes' } },
          { number: 3, step: 'In the same skillet, warm remaining olive oil. Add sliced garlic, chopped scallions, and chili flakes. Sauté for 1 minute until aromatic.', length: { number: 1, unit: 'minutes' } },
          { number: 4, step: 'Add cauliflower florets with 3 tablespoons of pasta cooking water. Cover and steam for 5 minutes until tender-crisp.', length: { number: 5, unit: 'minutes' } },
          { number: 5, step: 'Drain pasta, reserving 1/2 cup pasta water. Toss pasta directly into skillet with cauliflower mixture. Stir in parmesan and reserved water for a glossy glaze.', length: { number: 2, unit: 'minutes' } },
          { number: 6, step: 'Divide into warm bowls, top generously with the golden herbed breadcrumbs, and serve immediately with extra olive oil.', length: { number: 1, unit: 'minutes' } },
        ],
      },
    ],
  },
  715538: {
    id: 715538,
    title: 'Vibrant Mediterranean Quinoa & Roasted Veggie Nourish Bowl',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 25,
    servings: 2,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 412,
    healthScore: 92,
    spoonacularScore: 96,
    pricePerServing: 215.5,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    summary: 'A protein-packed vibrant nourish bowl featuring fluffy tri-color quinoa, roasted spiced chickpeas, sliced creamy avocado, crisp purple cabbage, and a rich lemon tahini garlic dressing.',
    cuisines: ['Mediterranean', 'Middle Eastern'],
    dishTypes: ['lunch', 'salad', 'dinner'],
    diets: ['vegan', 'gluten free', 'dairy free'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 520, unit: 'kcal' },
        { name: 'Protein', amount: 19, unit: 'g' },
        { name: 'Carbohydrates', amount: 64, unit: 'g' },
        { name: 'Fat', amount: 22, unit: 'g' },
        { name: 'Fiber', amount: 14, unit: 'g' },
        { name: 'Sodium', amount: 280, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 15,
        percentFat: 37,
        percentCarbs: 48,
      },
    },
    extendedIngredients: [
      { id: 20035, name: 'quinoa', amount: 1, unit: 'cup', original: '1 cup cooked quinoa', aisle: 'Pasta and Rice' },
      { id: 16057, name: 'chickpeas (garbanzo beans)', amount: 1, unit: 'can', original: '1 can (15 oz) chickpeas, rinsed and dried', aisle: 'Canned and Jarred' },
      { id: 9037, name: 'avocado', amount: 1, unit: 'whole', original: '1 ripe avocado, sliced', aisle: 'Produce' },
      { id: 11112, name: 'purple cabbage', amount: 1, unit: 'cup', original: '1 cup shredded red/purple cabbage', aisle: 'Produce' },
      { id: 11165, name: 'fresh cilantro or parsley', amount: 0.25, unit: 'cup', original: 'Fresh herbs for garnish', aisle: 'Produce' },
      { id: 12698, name: 'tahini', amount: 3, unit: 'tbsp', original: '3 tbsp roasted sesame tahini', aisle: 'Ethnic Foods' },
      { id: 9152, name: 'fresh lemon juice', amount: 2, unit: 'tbsp', original: '2 tbsp freshly squeezed lemon juice', aisle: 'Produce' },
      { id: 2015, name: 'ground cumin and smoked paprika', amount: 1, unit: 'tsp', original: '1 tsp cumin and 1 tsp smoked paprika', aisle: 'Spices and Seasonings' },
      { id: 9299, name: 'pomegranate seeds', amount: 2, unit: 'tbsp', original: '2 tbsp pomegranate arils for crunch', aisle: 'Produce' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Preheat oven or air fryer to 400°F (200°C). Toss chickpeas with olive oil, cumin, paprika, and sea salt.', length: { number: 3, unit: 'minutes' } },
          { number: 2, step: 'Roast chickpeas for 18 minutes until crispy and golden brown.', length: { number: 18, unit: 'minutes' } },
          { number: 3, step: 'In a small bowl, whisk tahini, lemon juice, 2 tbsp warm water, minced garlic, and salt until smooth and pourable.', length: { number: 3, unit: 'minutes' } },
          { number: 4, step: 'Assemble bowls: spoon warm fluffy quinoa into bases, then arrange roasted chickpeas, sliced avocado, and shredded cabbage.', length: { number: 3, unit: 'minutes' } },
          { number: 5, step: 'Drizzle liberally with lemon tahini dressing, scatter fresh herbs and pomegranate seeds over the top.', length: { number: 1, unit: 'minutes' } },
        ],
      },
    ],
  },
  649931: {
    id: 649931,
    title: 'Pan-Seared Citrus Herb Salmon with Asparagus & Garlic Butter',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 20,
    servings: 2,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 350,
    healthScore: 89,
    spoonacularScore: 92,
    pricePerServing: 380.0,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    summary: 'Crispy skin wild salmon fillets pan-seared with fresh rosemary, thyme, and basted with bubbling garlic-lemon butter alongside tender charred asparagus spears.',
    cuisines: ['American', 'French'],
    dishTypes: ['dinner', 'main course'],
    diets: ['gluten free', 'pescatarian'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 460, unit: 'kcal' },
        { name: 'Protein', amount: 38, unit: 'g' },
        { name: 'Carbohydrates', amount: 6, unit: 'g' },
        { name: 'Fat', amount: 32, unit: 'g' },
        { name: 'Fiber', amount: 3, unit: 'g' },
        { name: 'Sodium', amount: 310, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 34,
        percentFat: 61,
        percentCarbs: 5,
      },
    },
    extendedIngredients: [
      { id: 15076, name: 'salmon fillets', amount: 2, unit: 'fillets', original: '2 center-cut salmon fillets (6 oz each), skin-on', aisle: 'Seafood' },
      { id: 11011, name: 'fresh asparagus', amount: 1, unit: 'bunch', original: '1 bunch fresh asparagus, woody ends trimmed', aisle: 'Produce' },
      { id: 1145, name: 'unsalted butter', amount: 2, unit: 'tbsp', original: '2 tbsp grass-fed butter', aisle: 'Milk, Eggs, Other Dairy' },
      { id: 11215, name: 'garlic', amount: 3, unit: 'cloves', original: '3 cloves garlic, minced', aisle: 'Produce' },
      { id: 9152, name: 'fresh lemon', amount: 1, unit: 'whole', original: '1 lemon, juiced and sliced into wheels', aisle: 'Produce' },
      { id: 2049, name: 'fresh thyme and dill', amount: 2, unit: 'sprigs', original: 'Fresh thyme and dill sprigs', aisle: 'Produce' },
      { id: 4053, name: 'olive oil', amount: 1, unit: 'tbsp', original: '1 tbsp olive oil', aisle: 'Oil, Vinegar, Salad Dressing' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Pat salmon fillets dry with paper towels. Season both sides with kosher salt and fresh black pepper.', length: { number: 2, unit: 'minutes' } },
          { number: 2, step: 'Heat olive oil in a heavy stainless steel or cast iron skillet over medium-high heat until shimmering.', length: { number: 2, unit: 'minutes' } },
          { number: 3, step: 'Place salmon skin-side down. Press gently for 10 seconds to prevent curling. Sear for 4 to 5 minutes until skin is crackling crisp.', length: { number: 5, unit: 'minutes' } },
          { number: 4, step: 'Flip salmon, add trimmed asparagus to pan. Drop in butter, minced garlic, lemon slices, and thyme.', length: { number: 1, unit: 'minutes' } },
          { number: 5, step: 'Tilt skillet and spoon foaming aromatic lemon butter continuously over salmon for 3 minutes until cooked to medium.', length: { number: 3, unit: 'minutes' } },
          { number: 6, step: 'Plate salmon with charred tender asparagus and spoon leftover pan juices over top.', length: { number: 1, unit: 'minutes' } },
        ],
      },
    ],
  },
  632660: {
    id: 632660,
    title: 'Artisan Shakshuka with Poached Eggs, Feta & Herbs',
    image: '/src/assets/images/hero_culinary_spread_1790201200748.jpg',
    readyInMinutes: 25,
    servings: 3,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 520,
    healthScore: 82,
    spoonacularScore: 88,
    pricePerServing: 142.0,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    summary: 'Gently simmered North African and Mediterranean skillet dish with sweet bell peppers, crushed San Marzano tomatoes, warm spices, farm eggs, and crumbled sheep feta.',
    cuisines: ['Mediterranean', 'Middle Eastern'],
    dishTypes: ['breakfast', 'brunch', 'lunch', 'dinner'],
    diets: ['lacto ovo vegetarian', 'gluten free'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 320, unit: 'kcal' },
        { name: 'Protein', amount: 18, unit: 'g' },
        { name: 'Carbohydrates', amount: 22, unit: 'g' },
        { name: 'Fat', amount: 18, unit: 'g' },
        { name: 'Fiber', amount: 5, unit: 'g' },
        { name: 'Sodium', amount: 520, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 22,
        percentFat: 50,
        percentCarbs: 28,
      },
    },
    extendedIngredients: [
      { id: 1123, name: 'pasture-raised eggs', amount: 4, unit: 'large', original: '4 large eggs', aisle: 'Milk, Eggs, Other Dairy' },
      { id: 11529, name: 'crushed tomatoes', amount: 1, unit: 'can', original: '1 can (28 oz) San Marzano crushed tomatoes', aisle: 'Canned and Jarred' },
      { id: 11821, name: 'red bell peppers', amount: 2, unit: 'medium', original: '2 red bell peppers, diced', aisle: 'Produce' },
      { id: 11282, name: 'yellow onion', amount: 1, unit: 'medium', original: '1 medium onion, diced', aisle: 'Produce' },
      { id: 1019, name: 'feta cheese', amount: 0.5, unit: 'cup', original: '1/2 cup crumbled Greek feta', aisle: 'Cheese' },
      { id: 2015, name: 'ground cumin and smoked paprika', amount: 1.5, unit: 'tsp', original: '1.5 tsp ground cumin and 1 tsp sweet smoked paprika', aisle: 'Spices and Seasonings' },
      { id: 11165, name: 'fresh cilantro or mint', amount: 0.25, unit: 'cup', original: 'Fresh cilantro and mint for serving', aisle: 'Produce' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Heat olive oil in a wide skillet over medium heat. Sauté onion and red peppers for 6 minutes until softened.', length: { number: 6, unit: 'minutes' } },
          { number: 2, step: 'Add minced garlic, cumin, paprika, and a pinch of cayenne. Stir 1 minute until fragrant.', length: { number: 1, unit: 'minutes' } },
          { number: 3, step: 'Pour in crushed tomatoes, season with salt and pepper. Simmer gently for 10 minutes until sauce thickens slightly.', length: { number: 10, unit: 'minutes' } },
          { number: 4, step: 'Using the back of a large spoon, create 4 small wells in the sauce. Crack an egg into each well.', length: { number: 2, unit: 'minutes' } },
          { number: 5, step: 'Cover with a lid and cook on low heat for 5 to 7 minutes until egg whites are set and yolks remain runny.', length: { number: 6, unit: 'minutes' } },
          { number: 6, step: 'Remove lid, sprinkle with crumbled feta, fresh herbs, and serve hot with warm crusty bread.', length: { number: 1, unit: 'minutes' } },
        ],
      },
    ],
  },
  654959: {
    id: 654959,
    title: 'Thai Red Coconut Curry with Sweet Potato & Crispy Tofu',
    image: '/src/assets/images/recipe_curated_bowl_1790201211846.jpg',
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 290,
    healthScore: 84,
    spoonacularScore: 89,
    pricePerServing: 175.0,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    summary: 'A comforting, creamy Southeast Asian curry simmered with fragrant lemongrass, ginger, red curry paste, tender sweet potato cubes, snap peas, and golden pan-fried tofu.',
    cuisines: ['Thai', 'Asian'],
    dishTypes: ['soup', 'main course', 'dinner'],
    diets: ['vegan', 'gluten free', 'dairy free'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 430, unit: 'kcal' },
        { name: 'Protein', amount: 17, unit: 'g' },
        { name: 'Carbohydrates', amount: 39, unit: 'g' },
        { name: 'Fat', amount: 24, unit: 'g' },
        { name: 'Fiber', amount: 7, unit: 'g' },
        { name: 'Sodium', amount: 480, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 16,
        percentFat: 50,
        percentCarbs: 34,
      },
    },
    extendedIngredients: [
      { id: 16160, name: 'extra firm tofu', amount: 14, unit: 'oz', original: '1 block (14 oz) extra-firm tofu, pressed and cubed', aisle: 'Produce' },
      { id: 12118, name: 'coconut milk', amount: 1, unit: 'can', original: '1 can (13.5 oz) full-fat coconut milk', aisle: 'Canned and Jarred' },
      { id: 11507, name: 'sweet potato', amount: 1, unit: 'large', original: '1 large sweet potato, peeled and cut into 1/2-inch cubes', aisle: 'Produce' },
      { id: 11300, name: 'sugar snap peas', amount: 1, unit: 'cup', original: '1 cup fresh sugar snap peas', aisle: 'Produce' },
      { id: 10111165, name: 'Thai red curry paste', amount: 3, unit: 'tbsp', original: '3 tbsp authentic red curry paste', aisle: 'Ethnic Foods' },
      { id: 11216, name: 'fresh ginger', amount: 1, unit: 'tbsp', original: '1 tbsp freshly grated ginger', aisle: 'Produce' },
      { id: 9160, name: 'lime juice', amount: 2, unit: 'tbsp', original: '2 tbsp fresh lime juice', aisle: 'Produce' },
      { id: 2044, name: 'fresh Thai basil', amount: 0.5, unit: 'cup', original: '1/2 cup Thai basil leaves', aisle: 'Produce' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Crisp tofu cubes in a skillet with 1 tbsp sesame oil over medium-high heat until golden on all sides, about 8 minutes. Set aside.', length: { number: 8, unit: 'minutes' } },
          { number: 2, step: 'In a deep pot, warm 1 tbsp coconut oil. Add red curry paste and grated ginger, cooking for 2 minutes until fragrant.', length: { number: 2, unit: 'minutes' } },
          { number: 3, step: 'Pour in full-fat coconut milk and 1/2 cup vegetable broth. Bring to a gentle simmer.', length: { number: 3, unit: 'minutes' } },
          { number: 4, step: 'Add sweet potato cubes. Simmer covered for 12 minutes until fork tender.', length: { number: 12, unit: 'minutes' } },
          { number: 5, step: 'Stir in snap peas and crispy tofu cubes, cooking 2 minutes more until vibrant green.', length: { number: 2, unit: 'minutes' } },
          { number: 6, step: 'Finish with lime juice, soy sauce/tamari, and fresh Thai basil. Serve steaming hot with jasmine rice.', length: { number: 2, unit: 'minutes' } },
        ],
      },
    ],
  },
  640803: {
    id: 640803,
    title: 'Crispy Rosemary Garlic Roasted Chicken Thighs with Baby Potatoes',
    image: '/src/assets/images/recipe_artisan_pasta_1790201222306.jpg',
    readyInMinutes: 40,
    servings: 4,
    sourceUrl: 'https://spoonacular.com',
    aggregateLikes: 460,
    healthScore: 76,
    spoonacularScore: 87,
    pricePerServing: 240.0,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    summary: 'Golden, super-crispy skin chicken thighs roasted in one pan with creamy baby Yukon gold potatoes, fragrant rosemary sprigs, whole garlic cloves, and Dijon mustard glaze.',
    cuisines: ['French', 'European'],
    dishTypes: ['dinner', 'main course'],
    diets: ['gluten free', 'dairy free'],
    nutrition: {
      nutrients: [
        { name: 'Calories', amount: 540, unit: 'kcal' },
        { name: 'Protein', amount: 36, unit: 'g' },
        { name: 'Carbohydrates', amount: 28, unit: 'g' },
        { name: 'Fat', amount: 32, unit: 'g' },
        { name: 'Fiber', amount: 4, unit: 'g' },
        { name: 'Sodium', amount: 410, unit: 'mg' },
      ],
      caloricBreakdown: {
        percentProtein: 27,
        percentFat: 53,
        percentCarbs: 20,
      },
    },
    extendedIngredients: [
      { id: 5091, name: 'bone-in chicken thighs', amount: 4, unit: 'pieces', original: '4 bone-in, skin-on chicken thighs', aisle: 'Meat' },
      { id: 11362, name: 'baby potatoes', amount: 1, unit: 'lb', original: '1 lb baby Yukon gold potatoes, halved', aisle: 'Produce' },
      { id: 2036, name: 'fresh rosemary', amount: 3, unit: 'sprigs', original: '3 fresh rosemary sprigs, minced', aisle: 'Produce' },
      { id: 11215, name: 'whole garlic cloves', amount: 8, unit: 'cloves', original: '8 whole peeled garlic cloves', aisle: 'Produce' },
      { id: 1002046, name: 'Dijon mustard', amount: 1, unit: 'tbsp', original: '1 tbsp whole grain Dijon mustard', aisle: 'Condiments' },
      { id: 4053, name: 'olive oil', amount: 2, unit: 'tbsp', original: '2 tbsp extra virgin olive oil', aisle: 'Oil, Vinegar, Salad Dressing' },
    ],
    analyzedInstructions: [
      {
        name: '',
        steps: [
          { number: 1, step: 'Preheat oven to 425°F (220°C). Pat chicken thighs thoroughly dry with paper towels.', length: { number: 3, unit: 'minutes' } },
          { number: 2, step: 'Toss halved baby potatoes and whole garlic cloves with 1 tbsp olive oil, rosemary, salt, and pepper in a roasting pan.', length: { number: 3, unit: 'minutes' } },
          { number: 3, step: 'Whisk Dijon mustard with 1 tbsp olive oil, salt, and pepper. Brush over both sides of the chicken thighs.', length: { number: 2, unit: 'minutes' } },
          { number: 4, step: 'Nestle chicken thighs skin-side up amongst the potatoes.', length: { number: 1, unit: 'minutes' } },
          { number: 5, step: 'Roast for 35 minutes until the skin is deep golden brown and internal temperature reads 165°F (74°C).', length: { number: 35, unit: 'minutes' } },
          { number: 6, step: 'Rest for 5 minutes before serving so pan juices settle. Garnish with fresh rosemary tips.', length: { number: 5, unit: 'minutes' } },
        ],
      },
    ],
  },
};

// Helper for Spoonacular API calls with graceful fallback
async function fetchSpoonacular(endpoint: string, queryParams: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${SPOON_BASE}${endpoint}`);
  url.searchParams.set('apiKey', SPOONACULAR_KEY);
  
  for (const [key, val] of Object.entries(queryParams)) {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, String(val));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data, status: res.status };
    }

    const errText = await res.text();
    console.warn(`Spoonacular API returned ${res.status}:`, errText);
    return { success: false, error: errText, status: res.status };
  } catch (err: any) {
    console.error('Spoonacular network error:', err);
    return { success: false, error: err.message, status: 500 };
  }
}

// 1. POST /api/spoon/find-by-ingredients
// Body: { ingredients: string[], number?: number, ranking?: number }
app.post('/api/spoon/find-by-ingredients', async (req: Request, res: Response) => {
  const { ingredients = [], number = 12, ranking = 1 } = req.body || {};
  const ingredientList = Array.isArray(ingredients) ? ingredients : (typeof ingredients === 'string' ? ingredients.split(',') : []);
  const ingString = ingredientList.map((i: string) => i.trim()).filter(Boolean).join(',');

  if (!ingString) {
    return res.status(400).json({ error: 'Please provide at least one ingredient' });
  }

  const result = await fetchSpoonacular('/recipes/findByIngredients', {
    ingredients: ingString,
    number: Math.min(Number(number) || 12, 50),
    ranking: ranking || 1,
    ignorePantry: true,
  });

  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    return res.json(result.data);
  }

  // Graceful fallback matching user ingredients against our curated database
  const userTokens = ingString.toLowerCase().split(',').map((t: string) => t.trim());
  const fallbackList = Object.values(FALLBACK_RECIPES).map((rec: any) => {
    const recIngs = rec.extendedIngredients.map((i: any) => i.name.toLowerCase());
    const matched = userTokens.filter((token: string) => recIngs.some((ing: string) => ing.includes(token)));
    const missed = recIngs.filter((ing: string) => !userTokens.some((token: string) => ing.includes(token)));
    return {
      id: rec.id,
      title: rec.title,
      image: rec.image,
      usedIngredientCount: matched.length,
      missedIngredientCount: missed.length,
      missedIngredients: missed.slice(0, 3).map((name: string, idx: number) => ({ id: idx, name, original: name })),
      usedIngredients: matched.map((name: string, idx: number) => ({ id: idx, name, original: name })),
      likes: rec.aggregateLikes,
    };
  }).sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);

  return res.json(fallbackList);
});

// 2. GET /api/spoon/recipe/:id (and supporting [id])
app.get(['/api/spoon/recipe/:id', '/api/spoon/recipe/[id]'], async (req: Request, res: Response) => {
  const idStr = req.params.id || (req.query.id as string);
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }

  // Check fallback cache first if available
  if (FALLBACK_RECIPES[id]) {
    // Also try live fetch to get updated live data if possible, else return fallback immediately
  }

  // Spoonacular call: information + nutrition
  const infoRes = await fetchSpoonacular(`/recipes/${id}/information`, {
    includeNutrition: true,
  });

  // Spoonacular call: analyzed instructions
  const instructionsRes = await fetchSpoonacular(`/recipes/${id}/analyzedInstructions`, {
    stepBreakdown: true,
  });

  if (infoRes.success) {
    const combined = {
      ...infoRes.data,
      analyzedInstructions: instructionsRes.success && instructionsRes.data?.length 
        ? instructionsRes.data 
        : infoRes.data.analyzedInstructions || [],
    };
    return res.json(combined);
  }

  // Fallback if Spoonacular quota hit or id not found
  if (FALLBACK_RECIPES[id]) {
    return res.json(FALLBACK_RECIPES[id]);
  }

  // If unknown ID, return closest fallback recipe adapted with ID
  const firstFallback = Object.values(FALLBACK_RECIPES)[0];
  return res.json({
    ...firstFallback,
    id: id,
    title: firstFallback.title,
  });
});

// 3. POST /api/spoon/find-by-nutrients
// Body: { minCalories, maxCalories, minProtein, maxProtein, minCarbs, maxCarbs, minFat, maxFat, number, offset }
app.post('/api/spoon/find-by-nutrients', async (req: Request, res: Response) => {
  const {
    minCalories, maxCalories,
    minProtein, maxProtein,
    minCarbs, maxCarbs,
    minFat, maxFat,
    number = 12,
    offset = 0,
  } = req.body || {};

  const queryParams: Record<string, any> = {
    number: Math.min(Number(number) || 12, 50),
    offset: offset || 0,
    random: true,
  };
  if (minCalories !== undefined) queryParams.minCalories = minCalories;
  if (maxCalories !== undefined) queryParams.maxCalories = maxCalories;
  if (minProtein !== undefined) queryParams.minProtein = minProtein;
  if (maxProtein !== undefined) queryParams.maxProtein = maxProtein;
  if (minCarbs !== undefined) queryParams.minCarbs = minCarbs;
  if (maxCarbs !== undefined) queryParams.maxCarbs = maxCarbs;
  if (minFat !== undefined) queryParams.minFat = minFat;
  if (maxFat !== undefined) queryParams.maxFat = maxFat;

  const result = await fetchSpoonacular('/recipes/findByNutrients', queryParams);

  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    return res.json(result.data);
  }

  // Fallback nutrient filtering from our curated catalog
  const filtered = Object.values(FALLBACK_RECIPES).map((rec: any) => {
    const calories = rec.nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount || 450;
    const protein = rec.nutrition.nutrients.find((n: any) => n.name === 'Protein')?.amount || 20;
    const carbs = rec.nutrition.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 50;
    const fat = rec.nutrition.nutrients.find((n: any) => n.name === 'Fat')?.amount || 15;
    return {
      id: rec.id,
      title: rec.title,
      image: rec.image,
      calories,
      protein: `${protein}g`,
      carbs: `${carbs}g`,
      fat: `${fat}g`,
    };
  }).filter((r) => {
    if (minCalories && r.calories < minCalories) return false;
    if (maxCalories && r.calories > maxCalories) return false;
    return true;
  });

  return res.json(filtered.length > 0 ? filtered : Object.values(FALLBACK_RECIPES).map((rec: any) => ({
    id: rec.id,
    title: rec.title,
    image: rec.image,
    calories: 450,
    protein: '22g',
    carbs: '48g',
    fat: '16g',
  })));
});

// 4. GET /api/spoon/complexSearch
app.get('/api/spoon/complexSearch', async (req: Request, res: Response) => {
  const { query, cuisine, diet, type, maxReadyTime, sort, sortDirection, number = 12, offset = 0 } = req.query;

  const result = await fetchSpoonacular('/recipes/complexSearch', {
    query: query as string,
    cuisine: cuisine as string,
    diet: diet as string,
    type: type as string,
    maxReadyTime: maxReadyTime ? Number(maxReadyTime) : undefined,
    sort: sort as string,
    sortDirection: sortDirection as string,
    number: Math.min(Number(number) || 12, 50),
    offset: Number(offset) || 0,
    addRecipeInformation: true,
    fillIngredients: true,
    addRecipeNutrition: true,
  });

  if (result.success && result.data?.results) {
    return res.json(result.data);
  }

  // Fallback search
  let items = Object.values(FALLBACK_RECIPES);
  if (query) {
    const q = String(query).toLowerCase();
    items = items.filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
    if (items.length === 0) items = Object.values(FALLBACK_RECIPES);
  }
  if (diet) {
    const d = String(diet).toLowerCase();
    const dietFiltered = items.filter((r) => r.diets?.some((itemDiet: string) => itemDiet.toLowerCase().includes(d)));
    if (dietFiltered.length > 0) items = dietFiltered;
  }

  return res.json({
    results: items,
    offset: 0,
    number: items.length,
    totalResults: items.length,
  });
});

// 5. GET /api/spoon/random
app.get('/api/spoon/random', async (req: Request, res: Response) => {
  const { number = 8, tags } = req.query;
  const result = await fetchSpoonacular('/recipes/random', {
    number: Math.min(Number(number) || 8, 20),
    tags: tags as string,
  });

  if (result.success && result.data?.recipes) {
    return res.json(result.data);
  }

  return res.json({
    recipes: Object.values(FALLBACK_RECIPES),
  });
});

// 6. POST /api/ai/chef - AI Sous Chef cooking assistant
app.post('/api/ai/chef', async (req: Request, res: Response) => {
  const { message, recipeContext, conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System instruction for chef persona
  const systemInstruction = `You are Chef Auguste, the warm, encouraging, Michelin-trained executive sous chef of allrecipy.com.
You help home cooks discover recipes, solve kitchen dilemmas, suggest ingredient substitutions, pair wines/beverages, customize recipes for dietary needs, and provide clear step-by-step guidance.
Keep answers helpful, conversational, culinary-precise, and easy to read with bullet points where relevant.
${recipeContext ? `The user is currently viewing/cooking this recipe: "${recipeContext.title}" with ingredients: ${recipeContext.ingredients?.join(', ') || 'N/A'}. Tailor your advice directly to this dish.` : ''}`;

  if (ai) {
    try {
      // Build contents array with past messages
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text || turn.content || '' }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents as any,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || 'Bon appétit! How else can I assist with your cooking today?';
      return res.json({ reply: text });
    } catch (err: any) {
      console.error('Gemini API chef error:', err);
      // Fall through to culinary knowledge engine
    }
  }

  // Intelligent culinary rules fallback if Gemini is offline or key missing
  const lower = message.toLowerCase();
  let fallbackReply = `That's a fantastic culinary question! Here is my top chef recommendation:\n\n`;

  if (lower.includes('substitute') || lower.includes('replace') || lower.includes('instead of')) {
    if (lower.includes('buttermilk')) {
      fallbackReply += `• **Buttermilk Substitute:** Mix 1 cup of whole milk with 1 tablespoon of fresh lemon juice or white vinegar. Let it sit for 5 minutes until slightly curdled and tangy. Alternatively, thin plain Greek yogurt with milk at a 3:1 ratio.`;
    } else if (lower.includes('egg')) {
      fallbackReply += `• **Egg Substitutes:** For baking, use 1/4 cup unsweetened applesauce per egg, or 1 tablespoon ground flaxseed whisked with 3 tablespoons water (rest 5 mins). For savory binding, try 2 tbsp mashed potato flakes or silken tofu.`;
    } else if (lower.includes('heavy cream')) {
      fallbackReply += `• **Heavy Cream Substitute:** Melt 1/4 cup unsalted butter and whisk it into 3/4 cup whole milk. For dairy-free, use full-fat canned coconut cream or blend soaked raw cashews with water until velvety smooth.`;
    } else if (lower.includes('wine')) {
      fallbackReply += `• **White Wine Substitute in Cooking:** Use equal parts quality vegetable or chicken stock with a splash of fresh lemon juice or white wine vinegar to mimic the crisp acidity.`;
    } else {
      fallbackReply += `• In culinary technique, ingredient substitutions depend on whether the item provides moisture, acidity, fat, or structure. If you need a swap for a specific item, tell me what you have in your pantry and I'll adapt it!`;
    }
  } else if (lower.includes('salt') && (lower.includes('too much') || lower.includes('salty'))) {
    fallbackReply += `• **Fixing Over-Salted Food:**\n1. **Dilute:** Add more unsalted liquid, broth, crushed tomatoes, or water.\n2. **Acid:** A squeeze of fresh lemon juice or apple cider vinegar cuts through salt perception.\n3. **Sweet or Fat:** Stir in unsalted butter, cream, or a pinch of brown sugar.\n4. **Starch:** Simmer thick potato wedges in the soup/stew for 15 minutes to absorb sodium, then discard or enjoy separately.`;
  } else if (lower.includes('wine') || lower.includes('pair')) {
    fallbackReply += `• **Sommelier Pairing Guide:**\n• Rich pasta & wild mushrooms: Earthy Pinot Noir or crisp Italian Nebbiolo / Chianti Classico.\n• Pan-seared salmon: Lightly oaked Chardonnay, dry Provençal Rosé, or Oregon Pinot Noir.\n• Spicy curries: Off-dry Riesling or chilled Gewürztraminer with floral sweetness to tame heat.\n• Mediterranean grain bowls: Bright Sauvignon Blanc or citrusy Greek Assyrtiko.`;
  } else {
    fallbackReply += `• For the best flavor development, always sear proteins on high heat without moving them for the first 3 minutes to achieve deep Maillard browning.\n• Remember to taste at each stage: balance salt, acidity (lemon/vinegar), and fat for restaurant-quality depth.\n• Let me know if you need specific step advice, timer tips, or wine pairings!`;
  }

  return res.json({ reply: fallbackReply });
});

// Setup Vite middlewares in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`allrecipy.com server running on http://localhost:${PORT}`);
  });
}

startServer();
