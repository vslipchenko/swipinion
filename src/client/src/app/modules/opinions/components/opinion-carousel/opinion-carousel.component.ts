import {Component, Input} from '@angular/core';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {CardComponent} from '~app/shared/components/card/card.component';

@Component({
  selector: 'app-opinion-carousel',
  templateUrl: './opinion-carousel.component.html',
  styleUrls: ['./opinion-carousel.component.scss'],
  standalone: true,
  imports: [CardComponent],
})
export class OpinionCarouselComponent {
  @Input() protected data: Array<Opinion> = [];
}
