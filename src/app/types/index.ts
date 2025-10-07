export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
}

export interface FoodAnalysis {
  foodName: string;
  description: string;
  nutrition: NutritionInfo;
  healthSummary: string;
  ingredients?: string[];
  allergens?: string[];
}

export interface ImageUploaderProps {
  onImagesUpload: (files: File[]) => void;
  uploadedImages: string[];
  onRemoveImage: (index: number) => void;
}

export interface NutritionDisplayProps {
  analysis: FoodAnalysis | FoodAnalysis[];
}