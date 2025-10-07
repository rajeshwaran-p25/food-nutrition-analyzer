"use client";

import React from "react";
import { FoodAnalysis } from "../types/index";
import { Activity, AlertCircle, Leaf, Scale } from "lucide-react";
import { NutritionDisplayProps } from "../types/index";

export default function NutritionDisplay({ analysis }: NutritionDisplayProps) {
  const foodItems = Array.isArray(analysis) ? analysis : [analysis];

  if (foodItems.length === 0 || !foodItems[0].nutrition) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">No nutrition data available</p>
      </div>
    );
  }

  const renderFoodItem = (foodItem: FoodAnalysis, index: number) => {
    const nutritionItems = [
      {
        label: "Calories",
        value: foodItem.nutrition.calories,
        unit: "kcal",
        color: "bg-red-100 text-red-700",
      },
      {
        label: "Protein",
        value: foodItem.nutrition.protein,
        unit: "g",
        color: "bg-blue-100 text-blue-700",
      },
      {
        label: "Carbohydrates",
        value: foodItem.nutrition.carbohydrates,
        unit: "g",
        color: "bg-yellow-100 text-yellow-700",
      },
      {
        label: "Fat",
        value: foodItem.nutrition.fat,
        unit: "g",
        color: "bg-orange-100 text-orange-700",
      },
      {
        label: "Fiber",
        value: foodItem.nutrition.fiber,
        unit: "g",
        color: "bg-green-100 text-green-700",
      },
      {
        label: "Sugar",
        value: foodItem.nutrition.sugar,
        unit: "g",
        color: "bg-pink-100 text-pink-700",
      },
      {
        label: "Sodium",
        value: foodItem.nutrition.sodium,
        unit: "mg",
        color: "bg-purple-100 text-purple-700",
      },
    ];

    return (
      <div key={index} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Food Title and Description */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {foodItem.foodName}
          </h2>
          <p className="text-gray-600">{foodItem.description}</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
            <Scale className="w-4 h-4 mr-1" />
            {foodItem.nutrition.servingSize}
          </div>
        </div>

        {/* Nutrition Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Nutritional Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {nutritionItems.map((item) => (
              <div key={item.label} className={`rounded-lg p-3 ${item.color}`}>
                <div className="text-2xl font-bold">
                  {item.value}
                  {item.unit}
                </div>
                <div className="text-sm font-medium opacity-80">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Summary */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Health Summary
          </h3>
          <p className="text-gray-700">{foodItem.healthSummary}</p>
        </div>

        {/* Ingredients */}
        {foodItem.ingredients && foodItem.ingredients.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {foodItem.ingredients.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        {foodItem.allergens && foodItem.allergens.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              Potential Allergens
            </h3>
            <div className="flex flex-wrap gap-2">
              {foodItem.allergens.map((allergen, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {foodItems.map((foodItem, index) => renderFoodItem(foodItem, index))}
    </div>
  );
}
