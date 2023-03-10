import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {OpinionsView} from '~app/typings/opinion/opinion.enums';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {Store} from '@ngxs/store';
import {FetchGeneralOpinions} from '~app/modules/opinions/store/opinions.actions';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionsComponent implements OnInit {
  public readonly loading$ = new BehaviorSubject(false);
  private readonly view: OpinionsView;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly opinionService: OpinionService,
    private readonly store: Store,
  ) {
    this.view = (this.route.snapshot.data as {view: OpinionsView}).view;
  }

  public ngOnInit(): void {
    this.fetchOpinions();
  }

  private fetchOpinions(edgeId?: string): void {
    if (this.view === OpinionsView.General) this.store.dispatch(new FetchGeneralOpinions(edgeId));
  }
}
