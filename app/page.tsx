'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [scenario, setScenario] = useState('');
  const [cheatsheet, setCheatsheet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioCount, setScenarioCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setScenario('');
    setCheatsheet('');

    try {
      // First API call for scenario
      const scenarioRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          type: 'scenario'
        }),
      });

      if (!scenarioRes.ok) {
        throw new Error('Failed to generate scenario');
      }

      const scenarioData = await scenarioRes.json();
      setScenario(scenarioData.response);

      // Second API call for cheatsheet
      const cheatsheetRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          type: 'cheatsheet',
          scenario: scenarioData.response
        }),
      });

      if (!cheatsheetRes.ok) {
        throw new Error('Failed to generate cheatsheet');
      }

      const cheatsheetData = await cheatsheetRes.json();
      setCheatsheet(cheatsheetData.response);
      setScenarioCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setScenario('Error generating response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Medevac Scenario Generator</h1>
          <p className="text-gray-600">
            Generate realistic medevac scenarios for training purposes
          </p>
          <p className="text-sm text-gray-500">
            Scenarios Generated: {scenarioCount}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Additional Context (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Enter any additional context or requirements for the scenario..."
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Scenario...
              </span>
            ) : (
              'Generate New Scenario'
            )}
          </button>
        </form>

        {scenario && (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {scenario}
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/9line.png" 
                alt="9-Line Medevac Reference" 
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
            
            {cheatsheet && (
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-lg font-semibold text-blue-600 hover:text-blue-700">
                  <span>9-Line Cheatsheet</span>
                  <svg 
                    className="w-4 h-4 transition-transform group-open:rotate-180" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 whitespace-pre-wrap">
                  {cheatsheet}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
