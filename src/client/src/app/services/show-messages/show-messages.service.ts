import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowMessagesService {
  private readonly _showMessages$ = new BehaviorSubject(false);

  public show(): void {
    this._showMessages$.next(true);
  }

  public hide(): void {
    this._showMessages$.next(false);
  }

  public get showMessages$(): Observable<boolean> {
    return this._showMessages$.asObservable();
  }
}
