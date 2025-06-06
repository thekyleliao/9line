import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, type, scenario } = await req.json();
    
    // Read both PDF files
    const file1Path = path.join(process.cwd(), 'public', 'file1.pdf');
    const file2Path = path.join(process.cwd(), 'public', 'file2.pdf');
    
    const file1Buffer = fs.readFileSync(file1Path);
    const file2Buffer = fs.readFileSync(file2Path);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    if (type === 'scenario') {
      const prompt = `Create a realistic medevac scenario based on the knowledge in these PDFs.

      Important Requirements:
      - We are always BOILER 1
      - We are always calling BOILER 6
      - Generate a realistic 10-digit grid coordinate (e.g., 1234567890)
      - Create a grid zone identifier using 2 random numbers and 3 random letters (e.g., 12TEK)
      - Generate a 3-digit MHz frequency for training (e.g., 123 MHz)
      - Assume no encryption for training purposes
      - Make the scenario realistic and challenging but appropriate for training
      - Keep the response concise and to the point
      - DO NOT include the 9-line medevac request in your response

      Additional Context:
      ${message}

      Please format the response as a detailed scenario description including:
      - The grid coordinates and grid zone
      - The situation and environment
      - Relevant tactical considerations`;

      const response = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: file1Buffer.toString('base64')
          }
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: file2Buffer.toString('base64')
          }
        }
      ]);

      return NextResponse.json({ response: response.response.text() });
    } else {
      const prompt = `Based on this medevac scenario, generate ONLY a 9-line medevac request.

      Scenario:
      ${scenario}

      Important Requirements:
      - We are always BOILER 1
      - We are always calling BOILER 6
      - Use the grid coordinates and zone from the scenario
      - Use the frequency from the scenario
      - Keep the response simple and straightforward
      - DO NOT include any scenario description in your response
      - Use brevity codes from the provided PDFs
      - Include numbers before brevity codes when describing quantities (e.g., "5 A" for 5 ambulatory patients)

      Additional Context:
      ${message}

      Please format the response as 9 separate lines, one for each line of the medevac request:
      Line 1: Location (format: "Grid Zone [e.g., 12TEK] Grid Coordinates [e.g., 1234567890]")
      Line 2: Call Sign and Frequency (BOILER 1, include 3-digit MHz frequency)
      Line 3: Number of Patients
      Line 4: Special Equipment
      Line 5: Patient Status
      Line 6: Security
      Line 7: Marking
      Line 8: Patient Nationality
      Line 9: NBC Contamination`;

      const response = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: file1Buffer.toString('base64')
          }
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: file2Buffer.toString('base64')
          }
        }
      ]);

      return NextResponse.json({ response: response.response.text() });
    }
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
} 