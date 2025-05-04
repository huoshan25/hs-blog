interface WordCount {
  total: number;
  chinese: number;
  english: number;
  code: number;
}

interface ReadingTimeResult {
  /*阅读所需时间（分钟）*/
  minutes: number;
  words: WordCount;
}

/**
 * 计算文章需要的阅读时间
 * @param content 文章内容
 * @returns ReadingTimeResult 计算结果，包含阅读时间和字数统计
 */
export const useReadingTime = (content: string): ReadingTimeResult => {
  /*中文阅读速度：300字/分钟*/
  const CHINESE_WORDS_PER_MINUTE = 300;
  /*英文阅读速度：200词/分钟*/
  const ENGLISH_WORDS_PER_MINUTE = 200;
  /*代码阅读速度：150词/分钟*/
  const CODE_WORDS_PER_MINUTE = 150;

  if (!content) {
    return {
      minutes: 0,
      words: {
        total: 0,
        chinese: 0,
        english: 0,
        code: 0
      }
    };
  }

  /*提取代码块内容*/
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  /*计算代码的字数*/
  const codeLength = codeBlocks.reduce((acc, block) => {
    return acc + block.split(/\s+/).length;
  }, 0);

  /*移除代码块后的文本*/
  let cleanText = content.replace(/```[\s\S]*?```/g, "");

  /*统计中文字符*/
  const chineseChars = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length;

  /*统计英文单词（简单处理）*/
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fff]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  // 计算总阅读时间（分钟）
  const timeForChinese = chineseChars / CHINESE_WORDS_PER_MINUTE;
  const timeForEnglish = englishWords / ENGLISH_WORDS_PER_MINUTE;
  const timeForCode = codeLength / CODE_WORDS_PER_MINUTE;

  /*总时间*/
  const totalTimeInMinutes = timeForChinese + timeForEnglish + timeForCode;

  return {
    minutes: Math.ceil(totalTimeInMinutes),
    words: {
      total: chineseChars + englishWords + codeLength,
      chinese: chineseChars,
      english: englishWords,
      code: codeLength
    }
  };
};