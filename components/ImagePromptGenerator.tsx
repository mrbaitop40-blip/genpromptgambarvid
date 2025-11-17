
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Section } from './Section';
import { OutputBox } from './OutputBox';

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string, disabled?: boolean }> = ({ label, value, onChange, placeholder, disabled = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-on-surface-muted mb-1">{label}</label>
        <textarea value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} rows={4} className="w-full bg-brand-bg border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50" />
    </div>
);


export default function ImagePromptGenerator() {
    const [idea, setIdea] = useState('kucing di pasar');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promptIndo, setPromptIndo] = useState('');
    const [promptEng, setPromptEng] = useState('');

    const parseResponse = (responseText: string) => {
        if (!responseText) {
            return;
        }
        
        const indoMatch = responseText.match(/### 1\. Prompt Bahasa Indonesia \(Deskriptif\)([\s\S]*?)(?=### 2\.|$)/);
        const engMatch = responseText.match(/```text([\s\S]*?)```/);

        const indo = indoMatch ? indoMatch[1].trim() : '';
        const eng = engMatch ? engMatch[1].trim() : '';
        
        if (!indo && !eng) {
            setError("Gagal mem-parsing respons dari AI. Menampilkan output mentah di bawah.");
            setPromptIndo(responseText);
            setPromptEng('');
            return;
        }

        setPromptIndo(indo);
        setPromptEng(eng);
    };

    const handleGenerate = async () => {
        if (!idea.trim()) {
            setError("Harap masukkan ide terlebih dahulu.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPromptIndo('');
        setPromptEng('');
        
        const systemPrompt = `Anda adalah "AI Image Prompt Architect", sebuah mesin otomatis yang bertugas mengubah ide sederhana pengguna menjadi prompt gambar (image generation prompt) yang sangat detail, artistik, dan teknis untuk model seperti Imagen 3, Midjourney, atau Stable Diffusion.

TUGAS ANDA:
Setiap kali pengguna memberikan input (sekecil apapun), Anda harus LANGSUNG mengembangkan ide tersebut dengan parameter berikut:
1.  **Subject:** Perjelas subjeknya (detail fisik, ekspresi, pakaian).
2.  **Environment:** Tambahkan latar belakang yang kaya, atmosfer, dan cuaca.
3.  **Lighting:** Tentukan pencahayaan (Golden hour, Neon, Volumetric, Cinematic).
4.  **Style & Medium:** Tentukan gaya (Photorealistic, 3D Render, Oil Painting, Anime) dan kamera (85mm, Macro, Wide angle).
5.  **Technical Quality:** Tambahkan keyword (8k, UHD, masterpiece, highly detailed).

FORMAT OUTPUT (WAJIB DIPATUHI):
Anda harus memberikan output dalam format di bawah ini secara persis. Gunakan Code Block untuk memudahkan copy-paste.

---

### 1. Prompt Bahasa Indonesia (Deskriptif)
[Tuliskan deskripsi visual yang sangat mendetail dalam Bahasa Indonesia yang puitis dan jelas, menggambarkan suasana, pencahayaan, dan tekstur objek.]

### 2. Prompt Bahasa Inggris (Optimized for AI)
\`\`\`text
[Tuliskan prompt bahasa Inggris yang dioptimalkan dengan keyword teknis. Struktur: [Subject + Detail] + [Environment] + [Lighting + Mood] + [Camera/Style] + [Quality Keywords like 8k, intricate detail, photorealistic].]
\`\`\`
`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${systemPrompt}\n\nInput pengguna adalah: "${idea}"`,
            });
            
            parseResponse(response.text);

        } catch (e) {
            console.error(e);
            setError("Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs Column */}
            <div>
                <Section title="Generator Prompt Gambar">
                    <p className="text-on-surface-muted mb-4">Masukkan ide sederhana, dan AI akan mengembangkannya menjadi prompt yang detail dan artistik.</p>
                    <TextAreaField
                        label="Ide Anda"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Contoh: naga di atas gunung, astronot di hutan"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary-variant text-white font-bold py-3 px-4 rounded transition-colors disabled:bg-gray-600 disabled:cursor-wait"
                    >
                        {isLoading ? 'Menghasilkan...' : 'Hasilkan Prompt'}
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </Section>
            </div>

            {/* Outputs Column */}
            <div className="sticky top-8 self-start">
                <h2 className="text-2xl font-bold mb-4 text-center text-white">Hasil Prompt</h2>
                {(isLoading && !promptIndo) && (
                    <div className="text-center p-8 bg-surface rounded-lg shadow-lg">
                        <p className="text-on-surface-muted animate-pulse">AI sedang merangkai kata...</p>
                    </div>
                )}
                {promptIndo && <OutputBox title="Prompt Bahasa Indonesia (Deskriptif)" content={promptIndo} />}
                {promptEng && <OutputBox title="Prompt Bahasa Inggris (Optimized for AI)" content={promptEng} />}
            </div>
        </div>
    );
}
