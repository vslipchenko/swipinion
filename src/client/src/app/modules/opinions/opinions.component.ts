import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {OpinionsView} from '~app/typings/user-opinion/user-opinion.enums';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionsComponent {
  public readonly loading$ = new BehaviorSubject(false);
  private readonly view: OpinionsView;

  public constructor(private readonly route: ActivatedRoute) {
    this.view = (this.route.snapshot.data as {view: OpinionsView}).view;
  }
}
