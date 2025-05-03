import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "b3f26b82433b49978da7f07f3d2a5383";
// const ENDPOINT = `https://newsapi.org/v2/top-headlines?country=us&q=bitcoin&apiKey=${API_KEY}`;
// const ENDPOINT = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${API_KEY}`;

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputText, setInputText] = useState("");
  const [jeminitext, setJeminiText] = useState("");

  const onClickButton = async () => {
    const newsapiResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${inputText}&apiKey=${API_KEY}`
    );
    const data = await newsapiResponse.json();

    setTitle(data.articles[0].title);
    setContent(data.articles[0].description);
    console.log(data.articles[0].description);
    // 環境変数の読み込み
    const GEMINI_API_KEY: string = "AIzaSyDzHGDwxb8Nakjq_rlp2qvTl3mVwArofmU";

    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `次の文章を日本語にして、小学生がわかるように変更してください。\n${data.articles[0].description}`;
    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jeminitext = response.text();
    setJeminiText(jeminitext);
    console.log(jeminitext);
  };

  return (
    <>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={onClickButton}>送信！</button>
      <p>タイトル:{title}</p>
      <p>内容:{content}</p>
      <p>Geminiの回答:{jeminitext}</p>
    </>
  );
}

export default App;
