import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {OpinionCardComponent} from '~app/modules/opinions/components/opinion-card/opinion-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-opinion-carousel',
  templateUrl: './opinion-carousel.component.html',
  styleUrls: ['./opinion-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, OpinionCardComponent],
})
export class OpinionCarouselComponent {
  @Input() public data: Array<Opinion> = [];
}
