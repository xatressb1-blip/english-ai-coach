export interface FocusAnalysis {

  sentenceCount: number;

  isTooShort: boolean;

  isTooLong: boolean;

  isFocused: boolean;

  feedback: string;

}

export function analyzeFocus(

  question: string,

  answer: string

): FocusAnalysis {

  const sentences = answer

    .split(/[.!?]+/)

    .map(item => item.trim())

    .filter(item => item.length > 0);

  const sentenceCount =

    sentences.length;

  const isTooShort =

    sentenceCount < 3;

  const isTooLong =

    sentenceCount > 5;

  let feedback =

    "Good answer length.";

  if (isTooShort) {

    feedback =

      "Your answer is too short. Try answering in 3–5 complete sentences.";

  }

  if (isTooLong) {

    feedback =

      "Your answer is too long. Try to keep it concise and focused.";

  }

  const questionWords =

    question

      .toLowerCase()

      .split(/\W+/)

      .filter(word => word.length > 3);

  const answerLower =

    answer.toLowerCase();

  const matchedWords =

    questionWords.filter(word =>

      answerLower.includes(word)

    );

  const isFocused =

    matchedWords.length >=

    Math.max(1, Math.floor(questionWords.length / 4));

  if (!isFocused) {

    feedback +=

      " Your answer does not appear to address the interview question directly.";

  }

  return {

    sentenceCount,

    isTooShort,

    isTooLong,

    isFocused,

    feedback,

  };

}