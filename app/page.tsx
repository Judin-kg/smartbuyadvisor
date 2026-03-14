'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function SmartBuyAdvisorChat() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemPrompt: ChatMessage = {
    role: 'user',
    text:
      "You are SmartBuy Advisor, an AI assistant specializing in helping users make informed buying and selling decisions for new and used products. Your expertise covers vehicles, electronics, home appliances, furniture, and more. When providing new item suggestions, ask for budget and desired features. When valuing used items, ask for details like condition, age, and seller's asking price, and offer inspection guidance. Be helpful, concise, and data-driven. Do not mention that you are an AI model.",
  };

  // Initialize with greeting
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'model',
          text: 'Hello! I am SmartBuy Advisor. How can I help you make a smarter buying or selling decision today?',
        },
      ]);
    }
  }, [chatHistory.length]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (userMessage.trim() === '') return;

    const newUserMessage: ChatMessage = { role: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    try {
      const messagesToSend = [systemPrompt, ...chatHistory, newUserMessage].map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const payload = {
        contents: messagesToSend,
        generationConfig: {
          responseMimeType: 'text/plain',
        },
      };

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API error: ${response.status} - ${response.statusText}. Details: ${errorData}`);
      }

      const result = await response.json();

      let aiResponseText = 'Sorry, I could not generate a response. Please try again.';

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        aiResponseText = result.candidates[0].content.parts[0].text;
      }

      const newAiMessage: ChatMessage = { role: 'model', text: aiResponseText };
      setChatHistory((prev) => [...prev, newAiMessage]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'model',
          text: `Oops! Something went wrong: ${
            error instanceof Error ? error.message : String(error)
          }. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black font-sans p-4 text-white">
      {/* Header */}
      <header className="text-center py-4 mb-4 border-b border-gray-700">
        <h1 className="text-4xl font-bold text-green-400 tracking-tight drop-shadow-lg">SmartBuy Advisor</h1>
        <p className="text-md text-gray-400 mt-1">Your AI for Smarter Buying & Selling</p>
      </header>

      {/* Chat Area */}
      <div className="flex-grow bg-zinc-900 rounded-lg shadow-xl p-6 overflow-y-auto custom-scrollbar flex flex-col">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-4 rounded-xl max-w-[80%] ${
              message.role === 'user'
                ? 'bg-indigo-800 text-white self-end ml-auto neon-border-blue'
                : 'bg-green-950 text-lime-300 self-start neon-border-green'
            } shadow-md break-words`}
          >
            {message.role === 'model' ? (
              <div className="space-y-1">
                {message.text.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  const isBullet = /^(\d+[\.\)]|-|\•)/.test(trimmed);
                  return isBullet ? (
                    <li key={idx} className="ml-4 list-disc text-sm">
                      {trimmed}
                    </li>
                  ) : (
                    <p key={idx} className="text-sm">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm">{message.text}</p>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 p-3 rounded-xl bg-zinc-800 text-gray-400 self-start max-w-[80%] animate-pulse">
            <p className="text-sm">SmartBuy Advisor is thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex items-center bg-zinc-800 rounded-lg shadow-md p-4">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-600 rounded-xl bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Ask SmartBuy Advisor anything..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) sendMessage();
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="ml-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || userMessage.trim() === ''}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Send'
          )}
        </button>
      </div>

      {/* Custom Scrollbar + Neon Effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .neon-border-green {
          border-left: 3px solid #39FF14;
          box-shadow: 0 0 10px #39FF14;
        }
        .neon-border-blue {
          border-left: 3px solid #00FFFF;
          box-shadow: 0 0 10px #00FFFF;
        }
      `,
        }}
      />
    </div>
  );
}
