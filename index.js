const { send, json } = require('micro');
const botkit = require('botkit');
const SlackBot = require('slackbots');
const createMessage = require('./messages');
const request = require('request');

let whitelist = [];
if (!process.env.slacktoken) {
  console.log('Error: Specify token in environment');
  throw new Error('Error: Specify token in environment');
}
if (!process.env.whitelist) {
  console.log('Error: whitelist users');
  throw new Error('Error: whitelist users');
} else {
  whitelist = process.env.whitelist.split(';').map(pair => {
    let splitPair = pair.split(':');
    return { key: splitPair[0], value: splitPair[1] };
  });
  whitelist = whitelist.reduce(
    (prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    },
    {}
  );
}

const controller = botkit.slackbot({
  debug: false,
  scopes: ['bot', 'users:read']
});

const apiBot = new SlackBot({ token: process.env.slacktoken, name: 'gitbot' });

apiBot.getUsers().then(users => {
  let slackNames = Object.keys(whitelist).map(key => {
    return whitelist[key];
  });
  this.users = users.members.filter(user => {
    return slackNames.indexOf(user.name) > -1;
  });
});

apiBot.on('error', function(data) {
  console.log(data);
});

const bot = controller
  .spawn({ token: process.env.slacktoken, scopes: ['bot', 'users:read'] })
  .startRTM();


module.exports = async (req, res) => {
  request.put('https://simplecount.now.sh/api/56493916752419f1/increment');
  const body = await json(req);
  let slackSenderId = whitelist[body.sender.login];
  this.users
    .map(user => {
      return user;
    })
    .filter(user => user.name !== slackSenderId)
    .map(users => {
      return users;
    })
    .forEach(user => {
      bot.startPrivateConversation({ user: user.id }, (err, convo) => {
        convo.say(createMessage(body, req.headers['x-github-event']));
      });
    });
  send(res, 200, body.action || 'something happened but i dont know what');
};
