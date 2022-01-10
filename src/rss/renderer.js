import Modal from 'bootstrap/js/dist/modal';
import selectors from './selectors';
import { postPreview } from './handlers';

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

const renderPosts = (posts, i18next, state) => {
  const postContainer = document.querySelector(selectors.posts);
  if (!postContainer) {
    return;
  }

  postContainer.innerHTML = '';

  const postHeader = document.createElement('h3');
  postHeader.textContent = i18next.t('titlePosts');

  const postsBlocks = posts.map((post) => {
    const postBlock = document.createElement('div');
    postBlock.classList.add('mb-2', 'row');

    const postElement = document.createElement('div');
    postElement.classList.add('col-10');

    const title = document.createElement('a');
    title.href = post.link;
    title.textContent = post.title;
    const viewClass = state.uiState.viewedPosts.find((postId) => postId === post.id)
      ? 'fw-normal'
      : 'fw-bold';
    title.classList.add(viewClass);
    postElement.append(title);

    const btnBlock = document.createElement('div');
    btnBlock.classList.add('col-2');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('btn', 'btn-outline-primary');
    btn.textContent = i18next.t('titleShowPost');
    btn.dataset.postId = post.id;
    btnBlock.append(btn);
    btn.addEventListener('click', (e) => postPreview(e, state));

    postBlock.append(postElement, btnBlock);

    return postBlock;
  });

  postContainer.append(postHeader, ...postsBlocks);
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

const renderModal = (postId, postList) => {
  const postViewing = postList.find((post) => post.id === postId);

  if (!postViewing) {
    return;
  }

  const modalContainer = document.querySelector(selectors.modal);
  const modalTitle = modalContainer.querySelector(selectors.modalTitle);
  const modalBody = modalContainer.querySelector(selectors.modalBody);
  const modalShowLink = modalContainer.querySelector(selectors.modalShowLink);

  modalTitle.textContent = postViewing.title;
  modalBody.textContent = postViewing.description;
  modalShowLink.href = postViewing.link;

  const modal = new Modal(modalContainer);
  modal.show();
};

const clearForm = () => {
  const input = document.querySelector(selectors.rssAddInput);
  input.value = '';
  input.focus();
};

export default (path, value, i18next, state) => {
  switch (path) {
    case 'rssList':
      clearForm();
      renderFeeds(value, i18next);
      break;

    case 'postList':
      renderPosts(value, i18next, state);
      break;

    case 'form.valid':
      renderInput(value);
      break;

    case 'form.error':
      renderInvalidMessage(value);
      break;

    case 'uiState.viewedPosts':
      renderPosts(state.postList, i18next, state);
      break;

    case 'uiState.vieingPost':
      if (value !== null) {
        renderModal(value, state.postList);
      }
      break;

    default:
      break;
  }
};
