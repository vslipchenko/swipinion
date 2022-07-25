import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface SendUserMessage {
  receiverId: string;
  body: string;
}

export interface SendUserMessageMutationResult {
  sendUserMessage: SuccessResponse;
}
