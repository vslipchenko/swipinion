import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageAccordionService {
  public readonly liftUpConversationAccordion$ = new Subject<boolean>();
}
