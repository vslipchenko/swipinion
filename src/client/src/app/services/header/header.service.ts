import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public readonly signIn$ = new Subject<void>();
  public readonly signUp$ = new Subject<void>();
}
