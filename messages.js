module.exports = function createMessage(body, event) {
  switch (event) {
    case 'commit_comment':
      return createdComment(body);
    case 'pull_request':
      switch (body.action) {
        case 'opened':
        case 'edited':
        case 'closed':
        case 'reopened':
          return createdPullrequest(body);
        default:
          break;
      }
    case 'pull_request_review':
      return createdPullrequestReview(body);
    case 'pull_request_review_comment':
      return createdPullrequestReviewComment(body);
    case 'issues':
      switch (body.action) {
        case 'opened':
        case 'edited':
        case 'closed':
        case 'reopened':
          return issue(body);
        default:
          break;
      }
    case 'issue_comment':
      return issueComment(body);
    default:
      break;
  }
};

function createdComment(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.comment.body.substring(0, 100) + '...' } ],
        title: body.repository.name,
        title_link: body.comment.html_url,
        fallback: `Comment ${body.action} in ${body.repository.full_name} by ${body.comment.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: 'warning',
        text: `Comment *${body.action}* in <${body.repository.html_url}|${body.repository.full_name}> by <${body.comment.user.html_url}|${body.comment.user.login}>`
      }
    ]
  };
}

function createdPullrequest(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.pull_request.body.substring(0, 100) + '...' } ],
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.pull_request.html_url,
        fallback: `Pullrequest ${body.action} in ${body.repository.full_name} by ${body.pull_request.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: '#0A4CA1',
        text: `Pullrequest *${body.action}* in <${body.repository.html_url}|${body.repository.full_name}> by <${body.pull_request.user.html_url}|${body.pull_request.user.login}>`
      }
    ]
  };
}

function createdPullrequestReview(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.review.body.substring(0, 100) + '...' } ],
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.review.html_url,
        fallback: `Pullrequest ${body.review.state} in ${body.repository.name} by ${body.review.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: '#0A4CA1',
        text: `Pullrequest *${body.review.state}* in <${body.repository.html_url}|${body.repository.name}> by <${body.review.user.html_url}|${body.review.user.login}>`
      }
    ]
  };
}

function createdPullrequestReviewComment(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.comment.body.substring(0, 100) + '...' } ],
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.comment.html_url,
        fallback: `Pullrequest commented in ${body.repository.full_name} by ${body.comment.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: '#0A4CA1',
        text: `Pullrequest *<${body.comment.html_url}|commented>* in <${body.repository.html_url}|${body.repository.full_name}> by <${body.comment.user.html_url}|${body.comment.user.login}>`
      }
    ]
  };
}

function issue(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.issue.body.substring(0, 100) + '...' } ],
        title: `${body.issue.number}: ${body.issue.title}`,
        title_link: body.issue.html_url,
        fallback: `Issue ${body.action} in ${body.repository.name} by ${body.issue.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: '#0AA10C',
        text: `Issue *${body.action}* in <${body.repository.html_url}|${body.repository.name}> by <${body.issue.user.html_url}|${body.issue.user.login}>`
      }
    ]
  };
}

function issueComment(body) {
  return {
    attachments: [
      {
        fields: [ { value: body.issue.body.substring(0, 100) + '...' } ],
        title: `${body.issue.number}: ${body.issue.title}`,
        title_link: body.comment.html_url,
        fallback: `Issue Comment ${body.action} in ${body.repository.name} by ${body.issue.user.login}`,
        mrkdwn_in: [ 'text', 'pretext' ],
        color: '#0AA10C',
        text: `Issue Comment *${body.action}* in <${body.repository.html_url}|${body.repository.name}> by <${body.issue.user.html_url}|${body.issue.user.login}>`
      }
    ]
  };
}
