const { send, json } = require('micro');
const botkit = require('botkit');
const SlackBot = require('slackbots');
const createMessage = require('./messages');
const request = require('request');
const moment = require('moment');
require('now-logs')('now-slack-bot');

let whitelist = [];
let mutelist = {};
if (!process.env.slacktoken) {
  console.log('Error: Specify token in environment');
  throw new Error('Error: Specify token in environment');
}

if (!process.env.loadConfigUrl) {
  console.log('Error: Specify config url');
  throw new Error('Error: Specify config url');
}

const controller = botkit.slackbot({
  debug: true,
  scopes: ['bot'],
});

const apiBot = new SlackBot({ token: process.env.slacktoken, name: 'gitbot' });

apiBot.on('error', function(data) {
  console.log(data);
});

apiBot.getUsers().then(users => {
  if (whitelist) {
    let slackNames = Object.keys(whitelist).map(key => {
      return whitelist[key];
    });
    this.users = users.members.filter(user => {
      return slackNames.indexOf(user.name) > -1;
    });
  }
});

const bot = controller
  .spawn({ token: process.env.slacktoken })
  .startRTM(function(err) {
    if (err) {
      console.log('error: ', err);
      throw new Error(err);
    }
  });

controller.hears('^mute$$', ['direct_message'], (localBot, message) => {
  mutelist[message.user] = moment()
    .add(1, 'hour')
    .toDate();
  console.log('mute: ', mutelist);
  localBot.startConversation(message, (err, convo) => {
    if (err) {
      console.log(err);
    }
    convo.say('You are now muted for 1 hour');
    convo.next();
  });
});

controller.hears('^unmute$', ['direct_message'], (localBot, message) => {
  mutelist[message.user] = undefined;
  console.log('unmute: ', mutelist);
  localBot.startConversation(message, (err, convo) => {
    if (err) {
      console.log(err);
    }
    convo.say('You are now unmuted');
    convo.next();
  });
});

controller.hears('^muteinfo$', ['direct_message'], (localBot, message) => {
  localBot.startConversation(message, (err, convo) => {
    if (err) {
      console.log(err);
    }
    if (mutelist[message.user]) {
      convo.say('muted for ' + moment(mutelist[message.user]).fromNow(true));
    } else {
      convo.say('not muted');
    }
    convo.next();
  });
});

controller.hears('^help$', ['direct_message'], (localBot, message) => {
  localBot.startConversation(message, (err, convo) => {
    if (err) {
      console.log(err);
    }
    convo.say({
      attachments: [
        {
          text: [],
          title: `Commands`,
          mrkdwn_in: ['text', 'pretext', 'field'],
          color: '#0052cc',
          text: `
						*mute* - mute for 1 hour\n*unmute* - disable mute\n*muteinfo* - get information about muta status
					`,
        },
      ],
    });
    convo.next();
  });
});

controller.hears(
  '^reload$',
  ['direct_message', 'direct_mention'],
  (bot, message) => {
    request(process.env.loadConfigUrl, (error, response, body) => {
			let json = JSON.parse(body);
			whitelist = {};
      json.userMap.forEach(userObject => {
        whitelist[userObject.githubUsername] = userObject.slackUsername;
      });

      apiBot.getUsers().then(users => {
        let slackNames = Object.keys(whitelist).map(key => {
          return whitelist[key];
        });
        this.users = users.members.filter(user => {
          return slackNames.indexOf(user.name) > -1;
        });
      });
    });
  },
);

controller.hears('^info$', ['direct_message'], (localBot, message) => {
  console.log('info');
  if (this.users) {
    console.log('has User');
    // bot.reply(message, this.users.map(user => user.name));
    localBot.startConversation(message, (err, convo) => {
      if (err) {
        console.log(err);
      }
      console.log('started convo');
      convo.say('users:' + JSON.stringify(this.users.map(user => user.name)));
      convo.next();
    });
  } else {
    localBot.startConversation(message, (err, convo) => {
      if (err) {
        console.log(err);
      }
      convo.say('users:' + JSON.stringify(this.whitelist));
      convo.next();
    });
  }
});

module.exports = async (req, res) => {
  request.put('https://simplecount.now.sh/api/lake/56493916752419f1/increment');
  const body = await json(req);
  let slackSenderId = whitelist[body.sender.login];
  if (!this.users) {
    request(process.env.loadConfigUrl, (error, response, body) => {
      let json = JSON.parse(body);
      json.userMap.forEach(userObject => {
        whitelist[userObject.githubUsername] = userObject.slackUsername;
      });

      apiBot.getUsers().then(users => {
        let slackNames = Object.keys(whitelist).map(key => {
          return whitelist[key];
        });
        this.users = users.members.filter(user => {
          return slackNames.indexOf(user.name) > -1;
        });
        s(slackSenderId, body, req, res);
      });
    });
  } else {
    s(slackSenderId, body, req, res);
  }
};

s = (slackSenderId, body, req, res) => {
  this.users
    .map(user => {
      return user;
    })
    .filter(user => user.name !== slackSenderId)
    .map(users => {
      return users;
    })
    .filter(user => {
      console.log(user.name);
      console.log(mutelist[user.name]);
      return (
        !mutelist[user.name] || moment(mutelist[user.name]).isBefore(new Date())
      );
    })
    .forEach(user => {
      bot.startPrivateConversation({ user: user.id }, (err, convo) => {
        let message = createMessage(body, req.headers['x-github-event']);
        if (message) {
          convo.say(message);
        }
        convo.next();
      });
    });
  send(res, 200, body.action || 'something happened but i dont know what');
};
