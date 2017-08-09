module.exports = function createMessage(body, event) {
  console.log('Event: ', event);
  if (body && body.action) {
    console.log('Action: ', body.action);
  }
  if (body && body.changes) {
    console.log('Changes: ', body.changes);
  }
  switch (event) {
    case 'commit_comment':
      return createdComment(body);
    case 'pull_request':
      switch (body.action) {
        case 'opened':
        case 'edited':
        case 'reopened':
        case 'closed':
          return pullrequest(body);
        default:
          return;
      }
    case 'pull_request_review':
      return createdPullrequestReview(body);
    case 'pull_request_review_comment':
      return createdPullrequestReviewComment(body);
    case 'issues':
      switch (body.action) {
        case 'opened':
        case 'reopened':
          return issue(body);
        case 'closed':
        case 'edited':
          return issueWithoutText(body);
        default:
          return;
      }
    case 'issue_comment':
      return issueComment(body);
    default:
      return;
  }
};

function createdComment(body) {
  return {
    attachments: [
      {
        text: body.comment.body,
        title: body.repository.name,
        title_link: body.comment.html_url,
        fallback: `Comment ${body.action} in ${body.repository
          .full_name} by ${body.comment.user.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: 'warning',
        pretext: `Comment *${body.action}* in <${body.repository.html_url}|${body
          .repository.full_name}> by <${body.comment.user.html_url}|${body
          .comment.user.login}>`,
      },
    ],
  };
}

function pullrequest(body) {
  let field = body.pull_request.body;
  return {
    attachments: [
      {
        text: field,
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.pull_request.html_url,
        fallback: `Pullrequest ${body.action} in ${body.repository
          .full_name} by ${body.pull_request.user.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#f4ee42',
        pretext: `Pullrequest *${body.action}* in <${body.repository
          .html_url}|${body.repository.full_name}> by <${body.pull_request.user
          .html_url}|${body.pull_request.user.login}>`,
      },
    ],
  };
}

function createdPullrequestReview(body) {
  if (!body || !body.review) {
    return {};
  }
  if (
    body.review.state === 'changes_requested' ||
    body.review.state === 'pending'
  ) {
    return {};
  }
  return {
    attachments: [
      {
        text: body.review && body.review.body ? body.review.body : '',
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.review.html_url,
        fallback: `Pullrequest ${body.review.state} in ${body.repository
          .name} by ${body.review.user.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#f4ee42',
        pretext: `Pullrequest *${body.review.state}* in <${body.repository
          .html_url}|${body.repository.name}> by <${body.review.user
          .html_url}|${body.review.user.login}>`,
      },
    ],
  };
}

function createdPullrequestReviewComment(body) {
  return {
    attachments: [
      {
        text: body.comment.body,
        title: `${body.pull_request.number}: ${body.pull_request.title}`,
        title_link: body.comment.html_url,
        fallback: `Pullrequest commented in ${body.repository
          .full_name} by ${body.comment.user.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#f4ee42',
        pretext: `Pullrequest *<${body.comment.html_url}|commented>* in <${body
          .repository.html_url}|${body.repository.full_name}> by <${body.comment
          .user.html_url}|${body.comment.user.login}>`,
      },
    ],
  };
}

function issue(body) {
  return {
    attachments: [
      {
        title: `${body.issue.number}: ${body.issue.title}`,
        title_link: body.issue.html_url,
        fallback: `Issue ${body.action} in ${body.repository.name} by ${body
          .sender.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#0052cc',
        pretext: `Issue *${body.action}* in <${body.repository.html_url}|${body
          .repository.name}> by <${body.issue.user.html_url}|${body.sender
          .login}>`,
        text: body.issue.body,
      },
    ],
  };
}

function issueWithoutText(body) {
  return {
    attachments: [
      {
        text: [],
        title: `${body.issue.number}: ${body.issue.title}`,
        title_link: body.issue.html_url,
        fallback: `Issue ${body.action} in ${body.repository.name} by ${body
          .sender.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#0052cc',
        pretext: `Issue *${body.action}* in <${body.repository.html_url}|${body
          .repository.name}> by <${body.issue.user.html_url}|${body.sender
          .login}>`,
      },
    ],
  };
}

function issueComment(body) {
  return {
    attachments: [
      {
        text: body.comment.body,
        title: `${body.issue.number}: ${body.issue.title}`,
        title_link: body.comment.html_url,
        fallback: `Issue Comment ${body.action} in ${body.repository
          .name} by ${body.comment.user.login}`,
        mrkdwn_in: ['text', 'pretext', 'field'],
        color: '#0052cc',
        pretext: `Issue Comment *${body.action}* in <${body.repository
          .html_url}|${body.repository.name}> by <${body.comment.user
          .html_url}|${body.comment.user.login}>`,
      },
    ],
  };
}
