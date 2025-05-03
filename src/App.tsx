"use client"

import type React from "react"

import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import "./App.css"

// API keys (ideally these should be environment variables)
const NEWS_API_KEY = "b3f26b82433b49978da7f07f3d2a5383"
const GEMINI_API_KEY = "AIzaSyDzHGDwxb8Nakjq_rlp2qvTl3mVwArofmU"

function App() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("translated")
  const [newsData, setNewsData] = useState<{
    title: string
    content: string
    translatedContent: string
    url: string
    imageUrl: string | null
  } | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setError("Please enter a search term")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch news from NewsAPI
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query,
      )}&sortBy=publishedAt&pageSize=1&apiKey=${NEWS_API_KEY}`

      const newsResponse = await fetch(newsApiUrl)
      const newsData = await newsResponse.json()

      if (newsData.status !== "ok" || !newsData.articles || newsData.articles.length === 0) {
        setError(newsData.message || "No news found. Try a different search term.")
        setNewsData(null)
        setIsLoading(false)
        return
      }

      const article = newsData.articles[0]
      const title = article.title
      const content = article.description || "No content available"
      const url = article.url
      const imageUrl = article.urlToImage

      // Translate and simplify with Gemini
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
次の英語のニュース記事を日本語に翻訳し、小学生でも理解できるように簡単な言葉で説明してください。
専門用語があれば、それを簡単な言葉で説明してください。
結果は段落に分けて読みやすくしてください。

記事: ${content}
`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const translatedContent = response.text()

      setNewsData({
        title,
        content,
        translatedContent,
        url,
        imageUrl,
      })
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>News Translator</h1>
        <p className="app-description">Search for news and get simplified Japanese translations</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a topic (e.g., technology, bitcoin, climate)"
            className="search-input"
            disabled={isLoading}
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div className="error-alert">{error}</div>}

        {isLoading && <div className="loading-spinner">Loading...</div>}

        {!isLoading && newsData && (
          <div className="news-card">
            {newsData.imageUrl && (
              <div className="news-image-container">
                <img src={newsData.imageUrl || "/placeholder.svg"} alt={newsData.title} className="news-image" />
              </div>
            )}
            <div className="news-header">
              <h2 className="news-title">{newsData.title}</h2>
              <a href={newsData.url} target="_blank" rel="noopener noreferrer" className="news-link">
                Read original article
              </a>
            </div>
            <div className="news-content">
              <div className="tabs">
                <div className="tabs-list">
                  <button
                    className={`tab ${activeTab === "translated" ? "active" : ""}`}
                    onClick={() => setActiveTab("translated")}
                  >
                    日本語 (Japanese)
                  </button>
                  <button
                    className={`tab ${activeTab === "original" ? "active" : ""}`}
                    onClick={() => setActiveTab("original")}
                  >
                    Original
                  </button>
                </div>
                <div className="tab-content">
                  {activeTab === "translated" && (
                    <div className="translated-content">
                      {newsData.translatedContent.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  {activeTab === "original" && <p className="original-content">{newsData.content}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !newsData && !error && (
          <div className="empty-state">
            <p>Enter a search term to find and translate news</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
