import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../lib/openai";
import { FoodAnalysis } from "../../types";

export async function POST(request: NextRequest) {
  try {
    const formData = (await request.formData()) || [];
    const additionalText = (formData.get("text") as string) || "";

    // Get all images from formData
    const images: File[] = [];
    let imageUrls: string[] = [];
    formData.forEach((value, key) => {
      if (key === "image" || key === "images" || key.startsWith("image")) {
        if (value instanceof File) {
          images.push(value);
        }
      }
    });

   
    // Convert all images to base64
    if (images.length != 0) {
      imageUrls = await Promise.all(
        images.map(async (image) => {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64Image = buffer.toString("base64");
          return `data:${image.type};base64,${base64Image}`;
        })
      );
    }

    // Create the prompt
    const systemPrompt = `You are a nutrition expert AI. Analyze the food in the image(s) and provide detailed nutritional information.
    - If multiple images are provided, analyze all food items across all images and provide nutritional information as multiple separate responses.
    - Return Only a Valid JSON Object as per the schema below and without any additional text.
    - Do not include any explanations or additional text outside the JSON.
    - Don't wrap response with triple backticks or markdown formatting.
    - If the provided text or Image is not related to food, always respond with the schema, "Unknown" for foodName, Reason (why you return zero or empty values) for description and provide zeros or empty values for other fields.
    Return the response in the following JSON format:
    [{
      "foodName": "name of the food (or combined meal name if multiple items)",
      "description": "brief description of what you see",
      "nutrition": {
        "calories": number,
        "protein": number (in grams),
        "carbohydrates": number (in grams),
        "fat": number (in grams),
        "fiber": number (in grams),
        "sugar": number (in grams),
        "sodium": number (in mg),
        "servingSize": "estimated serving size"
      },
      "healthSummary": "brief health analysis and recommendations",
      "ingredients": ["list of visible or typical ingredients"],
      "allergens": ["potential allergens"]
}]`;

    const imageCount = images.length || 0;
    const userPrompt = additionalText
      ? `Analyze ${
          imageCount > 1 ? `these ${imageCount} food images` : "this food image"
        }. Additional context: ${additionalText}`
      : `Analyze ${
          imageCount > 1 ? `these ${imageCount} food images` : "this food image"
        } and provide nutritional information.`;


    // Build content array with text and all images
    const contentArray: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [{ type: "text", text: userPrompt }];

    imageUrls.forEach((url) => {
      contentArray.push({ type: "image_url", image_url: { url } });
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: contentArray,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;


    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const analysis: FoodAnalysis = JSON.parse(content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return NextResponse.json(
      { error: "Failed to analyze food image" },
      { status: 500 }
    );
  }
}
