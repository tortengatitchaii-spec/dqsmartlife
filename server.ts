import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getLocalDqResponse } from './src/utils/dqAiEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API endpoint for DQ Buddy assistant
app.post('/api/dq-buddy', async (req: Request, res: Response) => {
  try {
    const { prompt, conversationHistory } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Try Gemini API if initialized
    if (ai) {
      try {
        const systemInstruction = `คุณคือ "DQ Buddy" ผู้ช่วย AI เพื่อการเรียนรู้เรื่องความฉลาดทางดิจิทัล (Digital Intelligence: DQ) ประจำแอปพลิเคชัน "DQ SMART LIFE"
แหล่งอ้างอิงหลักของคุณคือบทความ "ความฉลาดทางดิจิทัล (Digital intelligence)" โดย ฉัตรพงศ์ ชูแสงนิล จาก สสวท. (Scimath)

กรอบ 8 ทักษะ DQ ที่ต้องยึดถือ:
1. Digital Citizen Identity (เอกลักษณ์พลเมืองดิจิทัล)
2. Screen Time Management (การบริหารจัดการเวลาบนโลกดิจิทัล)
3. Cyberbullying Management (การจัดการการกลั่นแกล้งบนไซเบอร์)
4. Cybersecurity Management (การจัดการความปลอดภัยบนโลกไซเบอร์)
5. Privacy Management (การจัดการความเป็นส่วนตัว)
6. Critical Thinking (การคิดอย่างมีวิจารณญาณ)
7. Digital Footprints (ร่องรอยทางดิจิทัล)
8. Digital Empathy (ความเห็นอกเห็นใจบนโลกดิจิทัล)

หน้าที่ของคุณ:
1. อธิบายคำศัพท์และแนวคิดเกี่ยวกับ Digital Intelligence ให้เข้าใจง่าย ชัดเจน ตรงประเด็น
2. ตอบคำถามและยกตัวอย่างสถานการณ์ในชีวิตจริงสำหรับนักเรียน นักศึกษา
3. หากผู้ใช้ปรึกษาสถานการณ์ออนไลน์ ให้วิเคราะห์ความเสี่ยง ระบุทักษะ DQ ที่เกี่ยวข้อง และให้ขั้นตอนการรับมือที่นำไปปฏิบัติได้จริง (Actionable Guidance)
4. หากคำถามอยู่นอกขอบเขตความฉลาดทางดิจิทัล เทคโนโลยี และความปลอดภัยออนไลน์ ให้แจ้งอย่างสุภาพและเป็นมิตรว่า "DQ Buddy เน้นให้ความรู้และคำปรึกษาด้านความฉลาดทางดิจิทัล (DQ) และความปลอดภัยบนโลกออนไลน์ครับ"
5. ใช้ภาษาไทยที่สุภาพ เป็นกันเอง มีกำลังใจ เสริมสร้างภูมิคุ้มกันดิจิทัล ไม่ใช้คำศัพท์เชิงเทคนิคจนเข้าใจยาก`;

        let contents: any[] = [];
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          contents = conversationHistory.slice(-6).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(msg.content) }],
          }));
        }
        contents.push({
          role: 'user',
          parts: [{ text: prompt }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const reply = response.text || getLocalDqResponse(prompt);
        res.json({ reply, source: 'gemini' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local DQ knowledge engine:', geminiError.message);
      }
    }

    // Fallback response
    const reply = getLocalDqResponse(prompt);
    res.json({ reply, source: 'local_knowledge' });
  } catch (err: any) {
    console.error('Error handling /api/dq-buddy:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
