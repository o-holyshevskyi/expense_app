import { TagIcon } from "@/components/icons/svgIcons";
import { Button, Chip, Form, Input } from "@heroui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  title: string;
}

interface Translations {
  [key: string]: string;
}

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [translations, setTranslations] = useState<Translations>({});
  const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
  const [newCategoryTranslation, setNewCategoryTranslation] = useState<string>("");
  const [errors, setErrors] = useState({});
  const { locale } = useRouter();

  useEffect(() => {
    if (locale) {
      fetch(`/api/categories?locale=${locale}`)
        .then((response) => response.json())
        .then((data) => {
          setCategories(data.categories);
          setTranslations(data.translations);
        });
    }
  }, [locale]);

  const handleAddCategory = (e: any) => {
    e.preventDefault();
    
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const categoryTitle = data.categoryTitle as string;    

    if (categories.map(category => category.title === categoryTitle)) {
        setErrors({categoryTitle: "Category is already exists"});
        return;
    }

    const newCategory: Category = {
      id: categories.length + 1,
      title: categoryTitle,
    };
    
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    // setTranslations((prevTranslations) => ({
    //   ...prevTranslations,
    //   [newCategory.id]: newCategoryTranslation,
    // }));

    setNewCategoryTitle("");
    setNewCategoryTranslation("");
  };

  return (
    <div>
        <div className="flex flex-grid gap-2">
            {categories.map((category) => (
                <Chip key={category.id} startContent={<TagIcon />} radius="sm">
                {translations[category.id] || category.title}
                </Chip>
            ))}
        </div>
        <Form 
            className="w-full text-default-900 m-5 max-w-xs flex flex-col gap-3"
            validationErrors={errors} onSubmit={handleAddCategory}
        >
            <Input
                // label="Username"
                // labelPlacement="outside"
                variant="bordered"
                name="categoryTitle"
                placeholder="Enter your category"
            />
            <Button type='submit'>
                Add
            </Button>
        </Form>
    </div>
  );
}
