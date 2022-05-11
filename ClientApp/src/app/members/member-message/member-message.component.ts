import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IMessage } from 'src/app/shared/models/iMessage';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css']
})
export class MemberMessageComponent implements OnInit {

  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: IMessage[];
  @Input() username: string;
  messageContent: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    })
  }
}
