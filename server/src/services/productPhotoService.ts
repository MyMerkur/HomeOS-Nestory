import { logger } from '../config/logger';
import { CATEGORIES, type Category } from '../constants/inventory';

export type ProductPhotoResult = {
  name: string;
  category: Category | null;
};

// A stable alias that always resolves to Google's current cheapest Flash-Lite
// model, so this doesn't silently 404 again as older dated versions retire.
const GEMINI_MODEL = 'gemini-flash-lite-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 15000;

const PROMPT = `You are identifying a single grocery/pantry/household item from a photo for a home inventory app.
Respond with the product's common Turkish name (short, generic, e.g. "Domates", not "Taze Salkım Domates 500g").
Pick the closest matching category from this exact list: ${CATEGORIES.join(', ')}.
Set "confident" to false if the photo does not clearly show one identifiable item (blurry, empty, multiple unrelated items, or not a household/grocery product).`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING' },
    category: { type: 'STRING', enum: [...CATEGORIES] },
    confident: { type: 'BOOLEAN' },
  },
  required: ['name', 'category', 'confident'],
};

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

type GeminiJsonPayload = {
  name?: string;
  category?: string;
  confident?: boolean;
};

function isValidCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

export async function identifyProductFromPhoto(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ProductPhotoResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: mimeType, data: imageBuffer.toString('base64') } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Gemini product photo lookup failed');
      return null;
    }

    const payload = (await response.json()) as GeminiResponse;
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as GeminiJsonPayload;
    if (!parsed.confident || !parsed.name?.trim()) return null;

    return {
      name: parsed.name.trim(),
      category: isValidCategory(parsed.category) ? parsed.category : null,
    };
  } catch (err) {
    logger.warn({ err }, 'Gemini product photo lookup failed');
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
