import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { concatMap, take, timer } from 'rxjs';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss',
})
export class AnswerComponent {
  @Input() answer: string | null = null;
  @Input() correctAnswer: string | null = null;
  @Input() isAnswerDisabled: boolean = false;

  @Output() onAnswerSelection: EventEmitter<void> = new EventEmitter<void>();
  @Output() onNewQuestionNeeded: EventEmitter<void> = new EventEmitter<void>();
  @Output() onPointsUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSelected: boolean = false;
  isCorrect: boolean = false;
  isWrong: boolean = false;

  checkAnswer(): void {
    this.isSelected = true;

    this.onAnswerSelection.emit();

    timer(2500)
      .pipe(
        take(1),
        concatMap(() => { // concatMap ensures that you can perform an action after another was finished

          this.isCorrect = this.answer === this.correctAnswer;
          this.isWrong = !this.isCorrect;
          this.onPointsUpdate.emit(this.isCorrect);

          // Return the second timer as an observable
          return timer(1000).pipe(take(1));
        })
      )
      .subscribe(() => {
        // reset values after the 2nd timer finishes
        this.resetValues();
      });
  }

  resetValues(): void {
    this.isSelected = false;
    this.isCorrect = false;
    this.isWrong = false;
    this.onNewQuestionNeeded.emit();
  }
}
