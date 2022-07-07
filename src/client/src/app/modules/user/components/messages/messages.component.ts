import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  public readonly tabs = [
    {text: 'Inbox', icon: 'inbox'},
    {text: 'Sent', icon: 'send'},
    {
      text: 'Saved',
      icon: 'inventory_2',
    },
  ];
  public messages = [
    {
      username: 'Johnny',
      thumbnail:
        'https://static.remove.bg/remove-bg-web/5c20d2ecc9ddb1b6c85540a333ec65e2c616dbbd/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      message: 'Hey!',
    },
    {
      username: 'Tonny',
      thumbnail: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg',
      message:
        'Lol some long message goes here but actually I dont care enough to make it to the certain point in the future where we dont need to worry',
    },
    {username: 'somenone', thumbnail: '', message: 'Something'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {username: 'keker', thumbnail: '', message: 'A'},
    {
      username: 'Whydafuck',
      thumbnail: 'https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg',
      message: 'B',
    },
  ];

  public showChat = false;

  constructor() {}

  ngOnInit(): void {}
}
