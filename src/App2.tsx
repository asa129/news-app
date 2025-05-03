import type React from "react";

import { useState } from "react";

export default function App2() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    content: string;
    simplified: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // ここでAPIリクエストを行う想定
    // 実際の実装では、ニュース取得とAI処理のAPIを呼び出します

    // デモ用のモックデータ
    setTimeout(() => {
      setResult({
        title: "新型コロナウイルス：新たな変異株について最新情報",
        content:
          "厚生労働省は本日、新型コロナウイルスの新たな変異株が確認されたと発表しました。この変異株は従来のものより感染力が高い可能性があるとされていますが、現在のワクチンの有効性については研究が続けられています。専門家は引き続き基本的な感染対策を継続するよう呼びかけています。",
        simplified:
          "新しいタイプのコロナウイルスが見つかりました。このウイルスは前のタイプより広がりやすいかもしれませんが、今のワクチンが効くかどうかはまだ調査中です。専門家は、マスクや手洗いなどの基本的な対策を続けることを勧めています。",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        ニュース簡易化アプリ
      </h1>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワードを入力してニュースを検索"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>検索</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 結果表示エリア */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* ニュースタイトル */}
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">ニュースタイトル</h2>
            <p className="text-lg">{result.title}</p>
          </div>

          {/* ニュース記事の内容 */}
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">ニュース記事の内容</h2>
            <p className="leading-relaxed">{result.content}</p>
          </div>

          {/* わかりやすく変換したニュースの内容 */}
          <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">わかりやすく変換した内容</h2>
            <p className="leading-relaxed">{result.simplified}</p>
          </div>
        </div>
      )}

      {/* 初期状態のガイド */}
      {!result && !loading && (
        <div className="text-center text-gray-500 py-12">
          <p className="mb-2">キーワードを入力して検索ボタンを押してください</p>
          <p>ニュース記事を取得してAIが簡単な言葉で説明します</p>
        </div>
      )}
    </div>
  );
}
