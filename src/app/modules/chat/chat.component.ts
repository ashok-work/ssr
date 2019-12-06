import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  conversation_id: string = null;
  chat_id: string = null;
  msg = '';
  chat = [];
  conversation: any = {};
  page = 0;
  typing_data = null;
  conversations = [];
  userStatus = false;

  constructor(
    public commonServices: CommonService,
    public route: ActivatedRoute,
    public router: Router,
    public utils: UtilsService,
    public socket: Socket,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.socket.on('userStatus', (data: any) => {
      let elementPos = this.conversations.findIndex(
        conversation => (Number(data['user_id']) === Number(conversation["host"]))
      );
      if (elementPos == -1) {
        elementPos = this.conversations.findIndex(
          conversation => (Number(data['user_id']) === Number(conversation["customer"]))
        );
      }
      if (elementPos !== -1) {
        this.conversations[elementPos]['online'] = data['online'];
      }
    });
  }

  ngOnInit() {
    this.resizeElements();

    this.route.queryParams.subscribe(
      params => {
        this.conversation_id = params.conversation_id;
        this.chat_id = params.chat_id;
        this.getAllConversations();
        this.initUser();
      }
    );

    this.socket.on('message', (data: any) => {
      console.log(data);
      this.chat.push(data);
      if (this.utils && data['chat_history_id']) {
        if (data['sender_id'] !== this.utils.user['user_id']) {
          this.socket.emit('read message', {
            chat_id: this.chat_id,
            user_id: this.utils.user['user_id'],
          });
        }
      }
    });


    this.socket.on('typing', (data: any) => {
      console.log(data);
      this.typing_data = data;
    });

    this.socket.on('not_typing', (data: any) => {
      console.log(data);
      this.typing_data = null;
    });

    this.socket.on('userStatus', (data: any) => {
      if (this.utils.user) {
        if (Number(this.utils.user['user_id']) !== Number(this.conversation['host'])) {
          this.userStatus = data['online'];
        } else if (Number(this.utils.user['user_id']) !== Number(this.conversation['customer'])) {
          this.userStatus = data['online'];
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth > 1015) {
      this.resizeElements();
    }
    else {
      this.resizeElements();
    }
  }

  resizeElements() {
    document.getElementById('custom-container').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('left-box').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('right-box').style.height = window.innerHeight - 57 + 'px';
    document.getElementById('chat-history').style.height = window.innerHeight - 167 + 'px';
  }

  async initUser() {
    if (!this.utils.user) await this.utils.initApp();
    if (this.conversation_id && this.chat_id && this.utils.user) {
      this.socket.emit('conversation:join', {
        user_id: this.utils.user,
        conversationId: this.conversation_id,
        chat_id: this.chat_id,
      });
      this.getConversation();
    }
  }

  getAllConversations() {
    const request = {
      action_url: "/chat",
      method: "GET",
      params: {}
    };

    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        this.commonServices.dismissLoading();
        this.conversations = data;
        this.checkUserStatus(this.conversations);
        if (!this.conversation_id || !this.chat_id) {
          this.joinConversation(this.conversations[0]);
        }
        for (let conversation of this.conversations) {
          if (conversation['conversation_id'] == this.conversation_id) conversation['total_unread'] = 0;
        }
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  getConversation() {
    let request = {
      action_url: `/chat/${this.chat_id}`,
      method: 'GET',
      params: {}
    };
    this.commonServices.presentLoading();
    this.commonServices.doHttp(request).subscribe(
      data => {
        this.conversation = data;
        this.getChatHistory();
        this.updateReadStatus();
        this.commonServices.dismissLoading();
      },
      err => {
        this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  getChatHistory() {
    let request = {
      action_url: `/chat/history/${this.chat_id}?page=${this.page}`,
      method: 'GET',
      params: {}
    };
    this.commonServices.doHttp(request).subscribe(
      (data: any) => {
        if (!this.page) this.commonServices.dismissLoading();
        if (this.page == 0) {
          this.chat = data;
        } else {
          this.chat = this.chat.reverse().concat(data).reverse();
        }
      },
      err => {
        if (!this.page) this.commonServices.dismissLoading();
        this.commonServices.errorHandler(err);
      }
    )
  }

  onSubmit() {
    if (this.msg) {
      const data = {
        chat_id: this.chat_id,
        conversationId: this.conversation_id,
        msg: this.msg,
        sender_id: this.utils.user['user_id'],
        customer: this.conversation['customer'],
        host: this.conversation['host'],
        created_at: new Date()
      };
      console.log(data);
      this.socket.emit('message', data);
      this.msg = null;
      this.typing_data = null;
      this.notTyping();
    } else {
      this.typing_data = null;
      this.notTyping();
    }
  }

  joinConversation(conversation) {
    this.router.navigate(['/chat'], {
      queryParams: {
        conversation_id: conversation['conversation_id'],
        chat_id: conversation['id'],
      }
    });
  }

  checkUserStatus(data: any) {
    data.forEach((item: any) => {
      if (this.utils) {
        if (Number(this.utils.user['user_id']) === Number(item['host'])) {
          this.socket.emit('checkUserStatus', {
            user_id: item['customer']
          });
        } else if (Number(this.utils.user['user_id']) === Number(item['customer'])) {
          this.socket.emit('checkUserStatus', {
            user_id: item['host']
          });
        }
      }
    });
  }

  typing() {
    this.socket.emit('typing', {
      msg: 'typing...',
      conversationId: this.conversation_id,
      user_name: this.utils.user['user_name'],
      sender_id: this.utils.user['user_id'],
    });
  }

  notTyping() {
    this.socket.emit('not_typing', {
      conversationId: this.conversation_id
    });
  }

  updateReadStatus() {
    this.socket.emit('read message', {
      chat_id: this.chat_id,
      user_id: this.utils.user['user_id']
    });
  }
}
