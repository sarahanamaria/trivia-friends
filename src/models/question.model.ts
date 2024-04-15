export interface IQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
  isAnswerDisabled?: boolean;
}