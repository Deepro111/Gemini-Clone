import { GoogleGenAI } from '@google/genai';

import dotenv from 'dotenv';
dotenv.config(); // Load .env values

const geminiAPIKey = process.env.GEMINI_API_KEY;


async function Chat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: geminiAPIKey, // Remove this for security in production
  });

  const config = {
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.0-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Answer the following in clean format, removing all extra whitespaces and using bold for important points:\n\n${prompt}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let finalOutput = '';

  for await (const chunk of response) {
    if (chunk?.text) {
      finalOutput += chunk.text;
    } else if (chunk?.parts?.[0]?.text) {
      finalOutput += chunk.parts[0].text;
    }
  }

  // Post-process the output to clean formatting
  const formattedOutput = formatPlainTextToHtml(finalOutput.trim());

  return formattedOutput;
}

function formatPlainTextToHtml(text) {
  // Convert Markdown-style bold to HTML <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Normalize and remove extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  // Split into lines
  const lines = text.split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      // Start a list if not already in one
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${trimmed.slice(2)}</li>`;
    } else if (trimmed === '') {
      // Empty line ends a paragraph and potentially a list
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<br>';
    } else {
      // Close list if current line is not a bullet
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${trimmed}</p>`;
    }
  });

  // Close any open list
  if (inList) html += '</ul>';

  return html;
}


export default Chat;
