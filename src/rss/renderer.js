import selectors from './selectors';

const renderFeeds = (feeds, i18next) => {
  const feedContainer = document.querySelector(selectors.feeds);
  if (!feedContainer) {
    return;
  }

  feedContainer.innerHTML = '';

  const feedHeader = document.createElement('h3');
  feedHeader.textContent = i18next.t('titleFeeds');

  const feedsElements = feeds.map((feed) => {
    const feedElement = document.createElement('div');
    feedElement.classList.add('mb-2');

    const title = document.createElement('div');
    title.classList.add('fw-bold');
    title.textContent = feed.title;

    const description = document.createElement('p');
    description.textContent = feed.description;

    feedElement.append(title, description);

    return feedElement;
  });

  feedContainer.append(feedHeader, ...feedsElements);
};

const renderPosts = (posts, i18next) => {
  const postContainer = document.querySelector(selectors.posts);
  if (!postContainer) {
    return;
  }

  postContainer.innerHTML = '';

  const postHeader = document.createElement('h3');
  postHeader.textContent = i18next.t('titlePosts');

  const postsElements = posts.map((post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('mb-2');

    const title = document.createElement('a');
    title.href = post.link;
    title.textContent = post.title;

    const description = document.createElement('p');
    description.textContent = post.description;

    postElement.append(title, description);

    return postElement;
  });

  postContainer.append(postHeader, ...postsElements);
};

const renderInput = (isValid) => {
  const input = document.querySelector(selectors.rssAddInput);
  if (!input) {
    return;
  }

  if (isValid) {
    input.classList.remove('is-invalid');

    return;
  }

  input.classList.add('is-invalid');
  input.focus();
};

const renderInvalidMessage = (message) => {
  const invalidFeedback = document.querySelector(selectors.invalidFeedback);
  if (!invalidFeedback) {
    return;
  }

  if (message === null) {
    invalidFeedback.textContent = '';

    return;
  }

  invalidFeedback.textContent = message;
};

const clearForm = () => {
  const input = document.querySelector(selectors.rssAddInput);
  input.value = '';
  input.focus();
};

export default (path, value, i18next) => {
  switch (path) {
    case 'rssList':
      clearForm();
      renderFeeds(value, i18next);
      break;

    case 'postList':
      renderPosts(value, i18next);
      break;

    case 'form.valid':
      renderInput(value);
      break;

    case 'form.error':
      renderInvalidMessage(value);
      break;

    default:
      break;
  }
};
