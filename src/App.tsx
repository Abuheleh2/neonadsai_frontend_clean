import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "https://19hninclo0gg.manus.space";

  const handleGenerateCopy = async () => {
    setLoading(true);
    setError(null);
    setVariations([]);

    try {
      const smartPrompt = `
أريدك أن تتصرف كخبير تسويق رقمي وتقوم بكتابة 3 إعلانات إبداعية وجذابة لنشرها على وسائل التواصل الاجتماعي.
تفاصيل المنتج/الخدمة:
${prompt}

يرجى توليد:
- عنوان جذاب (Headline)
- وصف موجز (Body)
- نداء للعمل (Call to Action)
- الفئة المستهدفة (Target Audience)

صيغة كل إعلان:
🚀 Ad Copy Variation X:
Headline: 
Body:
Call-to-Action:
Target:
      `;

      const response = await fetch(`${BACKEND_URL}/api/generate-copy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: smartPrompt, num_variations: 3 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setVariations(data.variations || []);
    } catch (err: any) {
      console.error("Error generating copy:", err);
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NeonAdsAi (Frontend POC)</h1>
      <div className="card">
        <h2>إنشاء إعلان تسويقي ذكي</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="أدخل تفاصيل المنتج أو الخدمة هنا (المنتج، الجمهور، القيمة المضافة)"
          rows={5}
          style={{ width: "80%", marginBottom: "10px", direction: "rtl" }}
        />
        <br />
        <Button onClick={handleGenerateCopy} disabled={loading}>
          {loading ? "جاري التوليد..." : "توليد النص الإعلاني"}
        </Button>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>خطأ: {error}</div>
        )}

        {variations.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>النصوص الإعلانية المولدة:</h3>
            <ul>
              {variations.map((variation, index) => (
                <li key={index} style={{ marginBottom: "15px", whiteSpace: "pre-wrap" }}>
                  {variation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="read-the-docs">
        نسخة تجريبية من NeonAdsAi - يجري العمل على ربط كافة الوظائف الكاملة.
      </p>
    </>
  );
}

export default App;


