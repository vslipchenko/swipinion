import {Clipboard} from '@angular/cdk/clipboard';
import {Location} from '@angular/common';
import {Injector} from '@angular/core';
import {UserStateModel} from '~app/modules/user/store/user.state';
import {StateContext} from '@ngxs/store';
import {OpinionsStateModel} from '~app/modules/opinions/store/opinions.state';

export const copyOpinionLink = (injector: Injector, opinionId: string): boolean => {
  const location = injector.get(Location);
  const clipboard = injector.get(Clipboard);

  let relativePath = location.prepareExternalUrl(`opinion/${opinionId}`);

  if (relativePath[0] !== '/') relativePath = '/' + relativePath; // If hash strategy is used - normalize by prepending slash (issue: https://github.com/angular/angular/issues/50917)

  return clipboard.copy(window.location.origin + relativePath);
};

export const toggleFavoriteOpinion = (
  context: StateContext<OpinionsStateModel>,
  opinionId: string,
  favorite: boolean,
): void => {
  context.setState((state) => {
    const opinions = state.opinions.map((opinion) =>
      opinion.id === opinionId
        ? {
            ...opinion,
            favorite,
          }
        : opinion,
    );

    return {
      ...state,
      opinions,
    };
  });
};

export const toggleUserFavoriteOpinion = (
  context: StateContext<UserStateModel>,
  opinionId: string,
  favorite: boolean,
): void => {
  context.setState((state) => {
    const nextState = {
      ...state,
    };

    const stateKey = state.profileOwner ? 'profileOpinions' : 'userOpinions';

    nextState[stateKey] = nextState[stateKey].map((opinion) =>
      opinion.id === opinionId
        ? {
            ...opinion,
            favorite,
          }
        : opinion,
    );

    return nextState;
  });
};
