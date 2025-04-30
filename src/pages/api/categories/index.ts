import fs from 'fs';
import path from 'path';

const readJSONFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJSONFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req: any, res: any) {
    const { locale } = req.query; // Get locale from the query
    const categoriesFilePath = path.join(process.cwd(), 'expense-categories.json');
    const enFilePath = path.join(process.cwd(), 'locales', 'en.json');
    const ukFilePath = path.join(process.cwd(), 'locales', 'uk.json');
  
    if (req.method === 'GET') {
        const categories = readJSONFile(categoriesFilePath);
        const enTranslations = readJSONFile(enFilePath);
        const ukTranslations = readJSONFile(ukFilePath);
    
        const translations = locale === 'uk' ? ukTranslations.expenseCategories.categories : enTranslations.expenseCategories.categories;
        
        res.status(200).json({
            categories: categories.expenseCategories,
            translations: translations,
        });
    }
  
    if (req.method === 'POST') {
        const newCategory = req.body;
        const categories = readJSONFile(categoriesFilePath);
        const enTranslations = readJSONFile(enFilePath);
        const ukTranslations = readJSONFile(ukFilePath);
    
        // Generate a new category ID (this could be improved with a better ID generation strategy)
        const newId = categories.expenseCategories.length + 1;
    
        // Add the new category to the categories list
        categories.expenseCategories.push({ id: newId, title: newCategory.title });
    
        // Add the translation for the new category in both locales
        enTranslations.expenseCategories.categories[newId] = newCategory.title;
        ukTranslations.expenseCategories.categories[newId] = newCategory.title;
    
        // Write the updated data back to the JSON files
        writeJSONFile(categoriesFilePath, categories);
        writeJSONFile(enFilePath, enTranslations);
        writeJSONFile(ukFilePath, ukTranslations);
    
        // Respond with the newly added category
        res.status(201).json({ success: true, category: { id: newId, title: newCategory.title } });
    }

  // Handle PUT and DELETE if necessary (for updating or removing categories)
}
