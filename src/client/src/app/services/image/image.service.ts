import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ImageBBResponse} from '~app/typings/imgbb/imgbb.interfaces';
import {IMGBB_API, IMGBB_API_KEY} from '~app/constants/imgbb';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public constructor(private readonly http: HttpClient) {}

  public uploadImage(file: File): Observable<ImageBBResponse> {
    const formData = new FormData();
    formData.append('image', file, file.name);
    // https://api.imgbb.com/
    return this.http.post<ImageBBResponse>(IMGBB_API, formData, {
      params: {key: IMGBB_API_KEY},
    });
  }
}
