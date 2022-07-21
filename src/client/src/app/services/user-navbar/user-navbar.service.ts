import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserNavbarService {
  public readonly shareOpinion$ = new Subject<void>();
}
