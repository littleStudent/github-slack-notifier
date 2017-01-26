_**Github Slack Notifier —** stay up to date with github notifications in slack_

## Usage

* Create a slack bot [here](https://autcoding.slack.com/apps/manage/custom-integrations) and get the **API Token**
* Create a whitelist like this: `"githubname1:slackname1;githubname2:slackname2"`
* deploy the bot
```
now -e slacktoken=<slack-token> -e whitelist=<githubname:slackname> littleStudent/github-slack-notifier
```
* Open the settings page of a repository or organisation settings and add a new webhook
* Set the payload URL to your **now deployment url**
* Selection content type **application/json**
* Selection **send me everything**
