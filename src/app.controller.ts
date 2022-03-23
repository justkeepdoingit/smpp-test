import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/test')
  testing(@Body() data: any){
    const myNumber: string = 'your-number(international format ex. 63951)';
    const from: string = 'admin.mapan'

    var smpp = require('smpp');
    var session = smpp.connect({
      url: `smpp://${data.host}:${data.port}`,
      auto_enquire_link_period: 10000,
      debug: true
    }, function() {
      session.bind_transceiver({
        system_id: `${data.username}`,
        password: `${data.password}`,
        // addr_ton: 5,
        // addr_npi: 14,
      }, function(pdu) {
        if (pdu.command_status === 0) {
          // Successfully bound
          session.submit_sm({
            source_addr: from,
            source_addr_ton: 5,
            source_addr_npi: 0,
            destination_addr: myNumber,
            dest_addr_npi: 1,
            dest_addr_ton: 1,
            short_message: `${data.message}`
          }, function(pdu) {
            if (pdu.command_status === 0) {
              // Message successfully sent
              console.log(pdu.message_id);
            }
          });
        }
      });
    });
  }
}

// console.log(data)
// const larvitsmpp = require('larvitsmpp');
// const LUtils = require('larvitutils');
// const lUtils = new LUtils();
// const log    = new lUtils.Log('debug');

// larvitsmpp.client({
//     'host':     `${data.host}`,
//     'port':     data.port,
//     'username': `${data.username}`,
//     'password': `${data.password}`,
//     'log':      log
// }, async function(err, clientSession) {
//     if (err) {
//         throw err;
//     }

//     await clientSession.sendSms({
//         'from':    from,
//         'to':       myNumber,
//         'message': `${data.message}`,
//         'dlr':     true
//     }, function(err, smsId, retPduObj) {
//         if (err) {
//             throw err;
//         }

//         console.log('Return PDU object:');
//         console.log(retPduObj);
//     });

    
//     await clientSession.on('dlr', function(dlr, dlrPduObj) {
//         console.log('DLR received:');
//         console.log(dlr);

//         console.log('DLR PDU object:');
//         console.log(dlrPduObj);

//         // Gracefully close connection
//         clientSession.unbind();
//     });
// });
