import type { ProductSearchFilters } from "../../types/product.types.js";
import { generateText } from "./gemini.js";

export const extractIntent = async (
  message: string,
): Promise<ProductSearchFilters> => {
  const prompt = `
You are an AI shopping assistant.

Your task is to extract product search filters from the user's message.

Return ONLY valid JSON.

Supported fields:

{
  "search": string,
  "category": string,
  "brand": string,
  "minPrice": number,
  "maxPrice": number,
  "inStock": boolean,
  "featured": boolean,
  "limit": number
}

Rules:

- Return only the fields mentioned by the user.
- If a field is not mentioned, omit it.
- Do not explain anything.
- Do not return markdown.
- Return valid JSON only.

User:

"${message}"
`;

  const response = await generateText(prompt);

  return JSON.parse(response);
};
