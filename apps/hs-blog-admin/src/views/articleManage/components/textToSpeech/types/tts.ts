export interface DialogueSegment {
  speaker: 'host' | 'guest';
  content: string;
}

export interface VoiceConfig {
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
}

export const VOICE_CONFIGS = {
  host: 'alloy',  // 主持人音色
  guest: 'echo'   // 嘉宾音色
};

export function parseDialogue(text: string): DialogueSegment[] {
  const segments: DialogueSegment[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    if (line.startsWith('火山：')) {
      segments.push({
        speaker: 'host',
        content: line.replace('火山：', '').trim()
      });
    } else if (line.startsWith('张教授：')) {
      segments.push({
        speaker: 'guest',
        content: line.replace('张教授：', '').trim()
      });
    }
  }

  return segments;
}