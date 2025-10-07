"use client";

import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import NutritionDisplay from "./NutritionDisplay";
import { FoodAnalysis } from "../types/index";
import { Loader2, Send } from "lucide-react";

export default function FoodAnalyzer() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [additionalText, setAdditionalText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImagesUpload = (files: File[]) => {
    const remainingSlots = 5 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages = [...selectedImages, ...filesToAdd];
    setSelectedImages(newImages);
    setError(null);
    setAnalysis(null);

    // Generate previews for new files
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0 && !additionalText.trim()) {
      setError("Please upload at least one image or provide text description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });
      formData.append("text", additionalText);

      const response = await fetch("/api/analyzer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data: FoodAnalysis = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Food Nutrition Analyzer
        </h1>
        <p className="text-gray-600">
          Upload a food image to get detailed nutritional information
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <ImageUploader
            onImagesUpload={handleImagesUpload}
            uploadedImages={imagePreviews}
            onRemoveImage={handleRemoveImage}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder="e.g., 'This is a homemade dish with olive oil' or 'Large portion size'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
              rows={3}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={(selectedImages.length === 0 && !additionalText.trim()) || isAnalyzing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Food
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {analysis ? (
            <NutritionDisplay analysis={analysis} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="text-gray-400">
                <p className="text-lg font-medium">No Analysis Yet</p>
                <p className="text-sm mt-2">
                  Upload an image and click analyze to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
