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
          <h1 className="text-3xl font-bold text-green-800">Medevac Scenario Generator</h1>
          <p className="text-green-700">
            Generate realistic medevac scenarios for training purposes
          </p>
          <p className="text-sm text-green-600">
            Scenarios Generated: {scenarioCount}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow-sm space-y-4 border border-green-200">
          <h2 className="text-lg font-semibold text-green-800">Training Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-green-700">
            <li>Generate a new scenario using the form below</li>
            <li>Write down your 9-line medevac request</li>
            <li>Compare your version with the AI-generated one</li>
            <li>Call +1 (646) 680-0895 and follow this format:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-green-600">
                <li>"Boiler 6, this is Boiler 1, how copy, over"</li>
                <li>Wait for response</li>
                <li>"Line 1, [your line 1], break"</li>
                <li>"Line 2, [your line 2], break"</li>
                <li>Continue through all 9 lines</li>
                <li>End with "over"</li>
                <li>After conversation, end with "over and out"</li>
              </ul>
            </li>
            <li>Target time: Complete the initial call-up in under 25 seconds</li>
            <li>The AI will engage in conversation and provide feedback on your performance</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-green-700">
              Additional Context (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Enter any additional context or requirements for the scenario..."
              className="w-full min-h-[100px] p-3 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
              <h2 className="text-lg font-semibold mb-2 text-green-800">Scenario</h2>
              <p className="whitespace-pre-wrap text-green-700">{scenario}</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <img 
                src="/9line.png" 
                alt="9-Line Medevac Reference" 
                className="max-w-full h-auto rounded-lg shadow-sm border border-green-200"
              />
              <img 
                src="/alphabet.png" 
                alt="NATO Phonetic Alphabet Reference" 
                className="max-w-full h-auto rounded-lg shadow-sm border border-green-200"
              />
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
              <h2 className="text-lg font-semibold mb-2 text-green-800">9-Line Cheatsheet</h2>
              <p className="text-sm text-green-600 mb-4">Call +1 (646) 680-0895 to practice the 9-line format</p>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-green-700">
                  <span className="font-medium">View 9-Line Format</span>
                  <svg
                    className="w-5 h-5 text-green-600 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4">
                  <p className="whitespace-pre-wrap text-green-700">{cheatsheet}</p>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
