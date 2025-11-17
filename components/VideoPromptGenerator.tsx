
import React, { useState, useEffect, useCallback } from 'react';
import type { Character, Dialogue, Environment } from '../types';
import { Section } from './Section';
import { OutputBox } from './OutputBox';
import { RACE_OPTIONS, GENDER_OPTIONS, VOICE_OPTIONS, LIGHTING_OPTIONS, CAMERA_ANGLE_OPTIONS, SHOT_TYPE_OPTIONS } from '../constants';

const initialCharacter: Omit<Character, 'id'> = {
    race: 'Indonesia',
    customRace: '',
    gender: 'Pria',
    age: '25',
    outfit: 'Kaos putih dan celana jeans',
    hairstyle: 'Rambut pendek hitam',
    voice: 'Baritone',
    description: 'Seorang petualang yang pemberani.',
};


// Helper Components
const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string, type?: string, disabled?: boolean }> = ({ label, value, onChange, placeholder, type = 'text', disabled = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-on-surface-muted mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="w-full bg-brand-bg border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50" />
    </div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly string[] | readonly { value: string; description: string; }[], disabled?: boolean }> = ({ label, value, onChange, options, disabled = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-on-surface-muted mb-1">{label}</label>
        <select value={value} onChange={onChange} disabled={disabled} className="w-full bg-brand-bg border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50">
            {options.map((opt, index) => {
                const optionValue = typeof opt === 'string' ? opt : opt.value;
                const optionLabel = typeof opt === 'string' ? opt : `${opt.value} - ${opt.description}`;
                return <option key={index} value={optionValue}>{optionLabel}</option>
            })}
        </select>
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string, disabled?: boolean }> = ({ label, value, onChange, placeholder, disabled = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-on-surface-muted mb-1">{label}</label>
        <textarea value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} rows={3} className="w-full bg-brand-bg border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50" />
    </div>
);


export default function VideoPromptGenerator() {
    const [characters, setCharacters] = useState<Character[]>([{...initialCharacter, id: crypto.randomUUID() }]);
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const [environment, setEnvironment] = useState<Environment>({
        description: 'Sebuah pasar malam yang ramai di Jakarta',
        lighting: 'neon lighting',
        cameraAngle: 'eye-level shot',
        shotType: 'medium shot',
        style: 'realistis, sinematik',
    });
    
    const [promptIndo, setPromptIndo] = useState('');
    const [promptEng, setPromptEng] = useState('');
    const [promptJson, setPromptJson] = useState('');

    const generatePrompts = useCallback(() => {
        const jsonObject = {
            characters: characters.map((c, i) => ({
                name: `Karakter ${i + 1}`,
                attributes: {
                    race: c.race === 'Lainnya...' ? c.customRace : c.race,
                    gender: c.gender,
                    age: c.age,
                    outfit: c.outfit,
                    hairstyle: c.hairstyle,
                    voice: c.voice,
                },
                description_and_action: c.description,
            })),
            scene: {
                environment: environment.description,
                lighting: environment.lighting,
                style: environment.style,
                camera: {
                    angle: environment.cameraAngle,
                    shot_type: environment.shotType,
                },
            },
            dialogues: dialogues.map(d => {
                const charIndex = characters.findIndex(c => c.id === d.characterId);
                return {
                    character: `Karakter ${charIndex + 1}`,
                    line: d.text,
                };
            }),
        };
        setPromptJson(JSON.stringify(jsonObject, null, 2));

        let indo = `Sebuah video dengan gaya ${environment.style}. Tipe pengambilan gambar: ${environment.shotType}, dengan sudut kamera: ${environment.cameraAngle}. Adegan berlatar di ${environment.description} dengan pencahayaan ${environment.lighting}.\n\n`;
        indo += `Menampilkan ${characters.length} karakter:\n`;
        characters.forEach((c, i) => {
            const race = c.race === 'Lainnya...' ? c.customRace : c.race;
            indo += `- Karakter ${i + 1}: Seorang ${c.gender} ras ${race} berusia ${c.age} tahun. Mengenakan ${c.outfit} dengan gaya rambut ${c.hairstyle}. Deskripsi/aksi: ${c.description}\n`;
        });
        if (dialogues.length > 0) {
            indo += `\nDialog:\n`;
            dialogues.forEach(d => {
                const charIndex = characters.findIndex(c => c.id === d.characterId);
                indo += `- Karakter ${charIndex + 1}: "${d.text}"\n`;
            });
        }
        setPromptIndo(indo);

        let eng = `A video in a ${environment.style} style. Shot type: ${environment.shotType}, with camera angle: ${environment.cameraAngle}. The scene is set in ${environment.description} with ${environment.lighting}.\n\n`;
        eng += `Featuring ${characters.length} character(s):\n`;
        characters.forEach((c, i) => {
            const race = c.race === 'Lainnya...' ? c.customRace : c.race;
            const gender = c.gender === 'Pria' ? 'male' : c.gender === 'Wanita' ? 'female' : 'non-binary';
            eng += `- Character ${i + 1}: A ${c.age}-year-old ${race} ${gender}. Wearing ${c.outfit} with a ${c.hairstyle} hairstyle. Description/action: ${c.description}\n`;
        });
        if (dialogues.length > 0) {
            eng += `\nDialogue:\n`;
            dialogues.forEach(d => {
                const charIndex = characters.findIndex(c => c.id === d.characterId);
                eng += `- Character ${charIndex + 1}: "${d.text}"\n`;
            });
        }
        setPromptEng(eng);

    }, [characters, dialogues, environment]);
    
    useEffect(() => {
        generatePrompts();
    }, [generatePrompts]);


    const handleAddCharacter = () => {
        setCharacters(prevChars => [...prevChars, { ...initialCharacter, id: crypto.randomUUID() }]);
    };

    const handleUpdateCharacter = (id: string, field: keyof Character, value: any) => {
        setCharacters(prevChars => prevChars.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleDeleteCharacter = (id: string) => {
        setCharacters(prevChars => prevChars.filter(c => c.id !== id));
        setDialogues(prevDialogues => prevDialogues.filter(d => d.characterId !== id));
    };

    const handleAddDialogue = () => {
        if (characters.length > 0) {
            setDialogues(prev => [...prev, { id: crypto.randomUUID(), characterId: characters[0].id, text: '' }]);
        }
    };

    const handleUpdateDialogue = (id: string, field: keyof Dialogue, value: string) => {
        setDialogues(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    const handleDeleteDialogue = (id: string) => {
        setDialogues(prev => prev.filter(d => d.id !== id));
    };
    
    const handleUpdateEnvironment = (field: keyof Environment, value: string) => {
        setEnvironment(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs Column */}
            <div>
                <Section title="Karakter" actions={<button onClick={handleAddCharacter} className="bg-primary hover:bg-primary-variant text-white font-bold py-2 px-4 rounded transition-colors">Tambah Karakter</button>}>
                   {characters.map((char, index) => (
                       <div key={char.id} className="bg-brand-bg p-4 rounded-lg mb-4 border border-border-color">
                           <div className="flex justify-between items-center mb-3">
                               <h3 className="text-lg font-semibold text-on-surface">Karakter {index + 1}</h3>
                               <button onClick={() => handleDeleteCharacter(char.id)} className="text-red-500 hover:text-red-400 font-bold py-1 px-3 rounded">Hapus</button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <div>
                                    <SelectField label="Ras/Etnis" value={char.race} onChange={(e) => handleUpdateCharacter(char.id, 'race', e.target.value)} options={RACE_OPTIONS} />
                                    {char.race === 'Lainnya...' && <InputField label="Ras Kustom" value={char.customRace} onChange={(e) => handleUpdateCharacter(char.id, 'customRace', e.target.value)} placeholder="e.g., Elf, Cyborg" />}
                                    <SelectField label="Gender" value={char.gender} onChange={(e) => handleUpdateCharacter(char.id, 'gender', e.target.value)} options={GENDER_OPTIONS} />
                                    <InputField label="Usia" type="number" value={char.age} onChange={(e) => handleUpdateCharacter(char.id, 'age', e.target.value)} placeholder="e.g., 30" />
                                </div>
                                <div>
                                    <InputField label="Outfit" value={char.outfit} onChange={(e) => handleUpdateCharacter(char.id, 'outfit', e.target.value)} placeholder="e.g., Jaket kulit hitam" />
                                    <InputField label="Gaya Rambut" value={char.hairstyle} onChange={(e) => handleUpdateCharacter(char.id, 'hairstyle', e.target.value)} placeholder="e.g., Mohawk" />
                                    <SelectField label="Suara" value={char.voice} onChange={(e) => handleUpdateCharacter(char.id, 'voice', e.target.value)} options={VOICE_OPTIONS} />
                                </div>
                           </div>
                           <TextAreaField label="Deskripsi & Aksi" value={char.description} onChange={(e) => handleUpdateCharacter(char.id, 'description', e.target.value)} placeholder="e.g., Sedang duduk di kafe sambil membaca buku." />
                       </div>
                   ))}
                </Section>

                <Section title="Dialog" actions={<button onClick={handleAddDialogue} disabled={characters.length === 0} className="bg-primary hover:bg-primary-variant text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Tambah Dialog</button>}>
                   {dialogues.map((dialogue) => (
                       <div key={dialogue.id} className="flex items-start gap-4 mb-3 p-3 bg-brand-bg rounded-lg border border-border-color">
                           <select value={dialogue.characterId} onChange={(e) => handleUpdateDialogue(dialogue.id, 'characterId', e.target.value)} className="bg-surface border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition">
                               {characters.map((c, i) => <option key={c.id} value={c.id}>Karakter {i + 1}</option>)}
                           </select>
                           <textarea value={dialogue.text} onChange={(e) => handleUpdateDialogue(dialogue.id, 'text', e.target.value)} placeholder={`Teks dialog untuk karakter...`} rows={2} className="flex-grow bg-surface border border-border-color rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition" />
                           <button onClick={() => handleDeleteDialogue(dialogue.id)} className="text-red-500 hover:text-red-400 font-bold py-1 px-3 self-center">Hapus</button>
                       </div>
                   ))}
                   {characters.length === 0 && <p className="text-on-surface-muted">Harap tambahkan karakter terlebih dahulu untuk memulai dialog.</p>}
                </Section>

                <Section title="Lingkungan & Kamera">
                    <InputField label="Deskripsi Lingkungan" value={environment.description} onChange={(e) => handleUpdateEnvironment('description', e.target.value)} placeholder="e.g., Hutan pinus berkabut di pagi hari" />
                    <InputField label="Gaya Visual" value={environment.style} onChange={(e) => handleUpdateEnvironment('style', e.target.value)} placeholder="e.g., Fantasi, sureal, anime 80an" />
                    <SelectField label="Pencahayaan" value={environment.lighting} onChange={(e) => handleUpdateEnvironment('lighting', e.target.value)} options={LIGHTING_OPTIONS} />
                    <SelectField label="Sudut Kamera" value={environment.cameraAngle} onChange={(e) => handleUpdateEnvironment('cameraAngle', e.target.value)} options={CAMERA_ANGLE_OPTIONS} />
                    <SelectField label="Tipe Pengambilan Gambar" value={environment.shotType} onChange={(e) => handleUpdateEnvironment('shotType', e.target.value)} options={SHOT_TYPE_OPTIONS} />
                </Section>
            </div>

            {/* Outputs Column */}
            <div className="sticky top-8 self-start">
                <h2 className="text-2xl font-bold mb-4 text-center text-white">Hasil Prompt</h2>
                <OutputBox title="Bahasa Indonesia" content={promptIndo} />
                <OutputBox title="Bahasa Inggris" content={promptEng} />
                <OutputBox title="JSON" content={promptJson} />
            </div>
        </div>
    );
}
