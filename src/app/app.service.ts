import { Injectable } from "@angular/core";
import data from "../assets/data/friends_questions_db.json";
import { Observable, of } from "rxjs";
import { IQuestion } from "../models/question.model";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    getQuestions(): Observable<IQuestion[]> {
        return of(data)
    }
}