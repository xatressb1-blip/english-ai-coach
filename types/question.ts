export interface Question {
  id: number;
  category: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  sampleAnswer: string;
  keywords?: string[];
  grammarFocus?: string[];
}
