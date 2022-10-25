import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageAccordionService {
  public readonly collapseAccordions$ = new Subject<void>();
  public readonly liftUpConversationAccordion$ = new Subject<boolean>();
}
