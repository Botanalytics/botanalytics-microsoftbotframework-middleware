var request = require('request')
module.exports = function(credentials) {
  if (!credentials || !credentials.token) {
    throw new Error('No token specified');
  }
  BotanalyticsMiddleware = {};

  BotanalyticsMiddleware.receive = function(session, next) {
    sendToBotanalytics(session,false,next);
  }

  BotanalyticsMiddleware.send = function(session, next) {
    sendToBotanalytics(session,true,next);
  }
  function sendToBotanalytics(session,is_sender_bot,next) {
         request({
            url: 'https://api.botanalytics.co/v1/microsoft-bot-framework/messages/',
            body: JSON.stringify({message: session,
            timestamp:new Date().getTime(),
            is_sender_bot:is_sender_bot}),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization':'Token '+ credentials.token
            }
    }, function(error, response, body){
        if(error) {
          next(error);
        } else if (response.statusCode != 200 || response.statusCode != 201) {
          next(new Error("Unexpected Status Code from Botanalytics API"));
        }else{
          next();
        }
   });
 }
 return BotanalyticsMiddleware;
}
