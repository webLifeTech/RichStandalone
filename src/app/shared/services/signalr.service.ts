import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

// Tell TypeScript we will use jQuery SignalR
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private connection: any;
  private hub: any;

  notification: any[] = [];
  walletInfo: any = {};
  connected = false;
  connectionId = '';

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  connect(token: string, onMessage: (msg: string, msgType: string) => void) {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject('Token missing');
        return;
      }

      console.log('Connecting to SignalR...');

      this.connection = $.hubConnection(this.baseUrl1);

      // Add Bearer Token
      this.connection.starting(() => {
        $.ajaxSetup({
          beforeSend: function (xhr: any) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          },
        });
      });

      this.hub = this.connection.createHubProxy('notificationHub');

      // Receive message → updatewallet
      this.hub.on('updatewallet', (message: string) => {
        // console.log('📩 Notification received:', message);
        onMessage(message, 'updatewallet');
      }, (error: any) => {
        console.log('updatewallet error >>>>:', error);
      });

      // Receive message → signalr
      this.hub.on('receiveNotification', (message: string) => {
        // console.log('📩 receiveNotification received:', message);
        onMessage(message, 'receiveNotification');
      }, (error: any) => {
        console.log('receiveNotification error >>>>:', error);
      });

      // Start connection
      this.connection
        .start({ transport: ['longPolling'] })
        .done(() => {
          console.log('✅ Connected with ID:', this.connection.id);
          this.connected = true;
          this.connectionId = this.connection.id;
          resolve(this.connection.id);
        })
        .fail((err: any) => {
          console.error('❌ Connection failed:', err);
          // return this.connection.start({ transport: ['longPolling'] });
          reject(err);
        });
    });
  }

  // Call server method
  sendMessage(userId: string) {
    return this.hub.invoke('SendRealTimeWalletInfo', userId);
  }


  // Notification -> SendRealTimeWalletInfo
  public SendRealTimeWalletInfo(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Notification/SendRealTimeWalletInfo?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
