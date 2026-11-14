import https from 'https';

/**
 * -------------------------------------------------------------
 * 1. SPEECHIFY TTS ENGINE (DEFAULT AI VOICE)
 * -------------------------------------------------------------
 */

// Splits text into safe, punctuation-preserving chunks
function splitTextIntoSafeChunks(rawText, maxLen = 1500) {
  let clean = (rawText || '').replace(/<\/?speak>/gi, '').trim();
  if (!clean) return [];

  function breakDown(text) {
    if (text.length <= maxLen) return [text];

    // Split on Hindi poornaviram, dot, question, exclamation, newline
    let parts = text.split(/(?<=[।\.\?\!\n]+)/g).filter(s => s.trim().length > 0);
    if (parts.length > 1 && parts.every(p => p.length < text.length)) {
      let result = [];
      for (const p of parts) result.push(...breakDown(p));
      return result;
    }

    // Split on commas or semicolons
    parts = text.split(/(?<=[,;،]+)/g).filter(s => s.trim().length > 0);
    if (parts.length > 1 && parts.every(p => p.length < text.length)) {
      let result = [];
      for (const p of parts) result.push(...breakDown(p));
      return result;
    }

    // Split on whitespace
    parts = text.split(/(?<=\s+)/g).filter(s => s.trim().length > 0);
    if (parts.length > 1 && parts.every(p => p.length < text.length)) {
      let result = [];
      for (const p of parts) result.push(...breakDown(p));
      return result;
    }

    // Hard fallback slice
    let slices = [];
    for (let i = 0; i < text.length; i += maxLen) {
      slices.push(text.slice(i, i + maxLen));
    }
    return slices;
  }

  const units = breakDown(clean);
  const chunks = [];
  let current = '';

  for (const u of units) {
    if ((current + u).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = u;
    } else {
      current += u;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// Extract PCM bytes from Speechify WAV buffer
function extractPcm(wavBuf) {
  let offset = 12;
  while (offset + 8 <= wavBuf.length) {
    const chunkId = wavBuf.subarray(offset, offset + 4).toString('ascii');
    const chunkSize = wavBuf.readUInt32LE(offset + 4);
    if (chunkId === 'data' || chunkSize === 4294967295) {
      return wavBuf.subarray(offset + 8);
    }
    offset += 8 + chunkSize + (chunkSize % 2);
  }
  return wavBuf.subarray(78);
}

// Build standard 44-byte WAV container from PCM buffers
function buildCleanWav(pcmBuffers, sampleRate = 24000) {
  const totalPcmLength = pcmBuffers.reduce((sum, b) => sum + b.length, 0);
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + totalPcmLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(1, 22); // Mono channel
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(totalPcmLength, 40);

  return Buffer.concat([header, ...pcmBuffers]);
}

// Single Speechify chunk HTTP request
function callSpeechifyChunk(chunkText, voice = 'mihika') {
  return new Promise((resolve, reject) => {
    const clean = chunkText.replace(/^\s*<speak>\s*/i, '').replace(/\s*<\/speak>\s*$/i, '').trim();
    const payload = JSON.stringify({
      text: `<speak>${clean}</speak>`,
      isDefaultText: true,
      voice: (voice || 'mihika').toLowerCase(),
      language: 'hi-IN',
      pageUrl: 'https://speechify.com/text-to-speech-online/',
      escape: false
    });

    const req = https.request('https://speechify.com/api/generate-audio/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://speechify.com',
        'Referer': 'https://speechify.com/text-to-speech-online/'
      }
    }, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const bodyStr = Buffer.concat(chunks).toString('utf8');
        try {
          const data = JSON.parse(bodyStr);
          if (res.statusCode >= 200 && res.statusCode < 300 && data.audioData) {
            resolve(Buffer.from(data.audioData, 'base64'));
          } else {
            reject(new Error(data.message || `Speechify API error ${res.statusCode}: ${bodyStr.slice(0, 150)}`));
          }
        } catch (e) {
          reject(new Error(`Speechify parse error: ${bodyStr.slice(0, 150)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Speechify API timeout after 12s'));
    });
    req.write(payload);
    req.end();
  });
}

export async function getFullSpeechifyAudio(text, voice = 'mihika') {
  const chunks = splitTextIntoSafeChunks(text, 1500);
  if (!chunks.length) return Buffer.alloc(0);
  if (chunks.length === 1) {
    return await callSpeechifyChunk(chunks[0], voice);
  }

  const pcmBuffers = [];
  for (const chunk of chunks) {
    const rawWav = await callSpeechifyChunk(chunk, voice);
    pcmBuffers.push(extractPcm(rawWav));
  }
  return buildCleanWav(pcmBuffers, 24000);
}

/**
 * -------------------------------------------------------------
 * 2. MICROSOFT EDGE TTS ENGINE (NEURAL VOICES)
 * -------------------------------------------------------------
 */

let msEdgeTtsPromise = null;
async function getMsEdgeTTS() {
  if (!msEdgeTtsPromise) {
    msEdgeTtsPromise = import('msedge-tts');
  }
  return msEdgeTtsPromise;
}

export async function getFullEdgeAudio(text, voice = 'hi-IN-SwaraNeural') {
  const { MsEdgeTTS, OUTPUT_FORMAT } = await getMsEdgeTTS();
  const tts = new MsEdgeTTS({
    enableLogger: false,
    connectionTimeoutMs: 20000,
    synthesisTimeoutMs: 30000
  });

  // Alias male/female voices if needed
  let targetVoice = voice || 'hi-IN-SwaraNeural';
  if (targetVoice === 'swara' || targetVoice === 'female') targetVoice = 'hi-IN-SwaraNeural';
  if (targetVoice === 'madhur' || targetVoice === 'male' || targetVoice === 'aarav') targetVoice = 'hi-IN-MadhurNeural';

  await tts.setMetadata(targetVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);

  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', c => chunks.push(c));
    audioStream.once('end', () => resolve(Buffer.concat(chunks)));
    audioStream.once('error', reject);
  });
}

/**
 * -------------------------------------------------------------
 * 3. GOOGLE TRANSLATE TTS ENGINE (FALLBACK)
 * -------------------------------------------------------------
 */

function splitGoogleText(text, maxLength = 150) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';
  for (const word of words) {
    if ((currentChunk + ' ' + word).trim().length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

function fetchGoogleTtsChunk(chunk, lang = 'hi') {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(chunk.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}&ttsspeed=1`;

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Google TTS failed with status: ${res.statusCode}`));
      const data = [];
      res.on('data', c => data.push(c));
      res.on('end', () => resolve(Buffer.concat(data)));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Google TTS timeout'));
    });
  });
}

export async function getFullGoogleTtsAudio(text, lang = 'hi') {
  const chunks = splitGoogleText(text, 150);
  const audioBuffers = [];
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const buf = await fetchGoogleTtsChunk(chunk, lang);
    audioBuffers.push(buf);
  }
  return Buffer.concat(audioBuffers);
}

/**
 * -------------------------------------------------------------
 * 4. UNIFIED MULTI-PROVIDER SYNTHESIZER WITH BULLETPROOF FALLBACK
 * -------------------------------------------------------------
 */

export async function synthesizeTts({ text, provider = 'speechify', voice = 'mihika', lang = 'hi' }) {
  const prov = (provider || 'speechify').toLowerCase();

  // 1. SPEECHIFY (DEFAULT SELECTED)
  if (prov === 'speechify') {
    try {
      const audio = await getFullSpeechifyAudio(text, voice || 'mihika');
      return { audio, contentType: 'audio/wav' };
    } catch (err) {
      console.warn('[TTS] Speechify temporarily unavailable, falling back to Edge TTS:', err.message);
      try {
        const fallbackEdge = (voice === 'rajiv' || voice === 'shlok') ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
        const audio = await getFullEdgeAudio(text, fallbackEdge);
        return { audio, contentType: 'audio/mpeg' };
      } catch (e2) {
        console.warn('[TTS] Edge fallback failed, using Google TTS:', e2.message);
        const audio = await getFullGoogleTtsAudio(text, lang);
        return { audio, contentType: 'audio/mpeg' };
      }
    }
  }

  // 2. MICROSOFT EDGE TTS
  if (prov === 'edge') {
    try {
      const audio = await getFullEdgeAudio(text, voice || 'hi-IN-SwaraNeural');
      return { audio, contentType: 'audio/mpeg' };
    } catch (err) {
      console.warn('[TTS] Edge TTS temporarily unavailable, falling back to Google TTS:', err.message);
      const audio = await getFullGoogleTtsAudio(text, lang);
      return { audio, contentType: 'audio/mpeg' };
    }
  }

  // 3. GOOGLE TRANSLATE TTS
  const audio = await getFullGoogleTtsAudio(text, lang);
  return { audio, contentType: 'audio/mpeg' };
}
