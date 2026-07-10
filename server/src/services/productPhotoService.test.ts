import { identifyProductFromPhoto } from './productPhotoService';

let fetchSpy: jest.SpiedFunction<typeof fetch>;
const originalApiKey = process.env.GEMINI_API_KEY;

beforeEach(() => {
  fetchSpy = jest.spyOn(global, 'fetch');
  process.env.GEMINI_API_KEY = 'test-key';
});

afterEach(() => {
  fetchSpy.mockRestore();
  process.env.GEMINI_API_KEY = originalApiKey;
});

function mockGeminiResponse(json: unknown) {
  fetchSpy.mockResolvedValue(
    new Response(
      JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify(json) }] } }],
      }),
      { status: 200 },
    ),
  );
}

describe('identifyProductFromPhoto', () => {
  it('returns null without calling the API when GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns the identified name and category when confident', async () => {
    mockGeminiResponse({ name: 'Domates', category: 'Vegetable', confident: true });

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toEqual({ name: 'Domates', category: 'Vegetable' });
  });

  it('returns null when the model is not confident', async () => {
    mockGeminiResponse({ name: '', category: 'Other', confident: false });

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toBeNull();
  });

  it('falls back to a null category when the model returns an invalid category', async () => {
    mockGeminiResponse({ name: 'Mystery Item', category: 'NotARealCategory', confident: true });

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toEqual({ name: 'Mystery Item', category: null });
  });

  it('returns null when the upstream request fails', async () => {
    fetchSpy.mockRejectedValue(new Error('network error'));

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toBeNull();
  });

  it('returns null when the upstream responds with a non-ok status', async () => {
    fetchSpy.mockResolvedValue(new Response('rate limited', { status: 429 }));

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toBeNull();
  });

  it('returns null when the response text is not valid JSON', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({ candidates: [{ content: { parts: [{ text: 'not json' }] } }] }),
        { status: 200 },
      ),
    );

    const result = await identifyProductFromPhoto(Buffer.from('fake'), 'image/jpeg');

    expect(result).toBeNull();
  });
});
