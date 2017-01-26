_**Github Slack Notifier —** stay up to date with github notifications in slack_

## Usage

* Create a slack bot [here](https://autcoding.slack.com/apps/manage/custom-integrations) and get the **API Token**
* Create a whitelist like this: `"githubUsername1:slackUsername1;githubUsername2:slackUsername2"`
* deploy the bot
```
now -e slacktoken=<slack-token> -e whitelist=<githubUsername:slackUsername> littleStudent/github-slack-notifier
```
* Open the settings page of a repository or organisation and add a new **webhook**
* Set the payload URL to your **now deployment url**
* Select content type **application/json**
* Select **send me everything**
