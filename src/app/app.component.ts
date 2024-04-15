import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { IQuestion } from '../models/question.model';
import { NgFor } from '@angular/common';
import { AnswerComponent } from '../components/answer/answer.component';
import { QuestionComponent } from '../components/question/question.component';
import { RouterOutlet } from '@angular/router';
import { CounterComponent } from '../components/counter/counter.component';
import { CHECKPOINTS } from '../constants/checkpoint.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    QuestionComponent,
    AnswerComponent,
    NgFor,
    CounterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  allQuestionsData: IQuestion[] | null = null;

  currentQuestionIndex: number = 0;
  currentQuestionState: IQuestion | null = null;

  currentPlayerPoints: number = 0;
  gameStatus: string | null = null;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.getAllQuestionsData();
  }

  setNewQuestion(): void {
    if (
      !this.allQuestionsData ||
      this.currentQuestionIndex >= this.allQuestionsData.length
    ) {
      this.resetGame();
      return;
    }

    const questionData = this.allQuestionsData[this.currentQuestionIndex]; // set question based on the index

    this.currentQuestionState = {
      question: questionData.question,
      answers: questionData.answers,
      correctAnswer: questionData.correctAnswer,
      isAnswerDisabled: questionData.isAnswerDisabled,
    };

    this.currentQuestionIndex++;
  }

  disableOtherAnswers(): void {
    if (!this.currentQuestionState) {
      return;
    }

    this.currentQuestionState.isAnswerDisabled = true;
  }

  setNewPoints(isAnswerCorrect: boolean): void {
    if (isAnswerCorrect) {
      this.currentPlayerPoints++;
      this.gameStatus = CHECKPOINTS[this.currentPlayerPoints];
    }
  }

  private getAllQuestionsData(): void {
    this.appService.getQuestions().subscribe((data: IQuestion[]) => {
      this.allQuestionsData = this.shuffleQuestions([...data]);
      this.setNewQuestion();
    });
  }

  private shuffleQuestions(questions: IQuestion[]): IQuestion[] {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  private resetGame(): void {
    this.allQuestionsData = null;
    this.currentQuestionIndex = 0;
    this.currentQuestionState = null;
    this.currentPlayerPoints = 0;
    this.gameStatus = null;
    this.getAllQuestionsData();
  }
}
