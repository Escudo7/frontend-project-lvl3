import axios from 'axios';
import _ from 'lodash';
import validate from './validation.js';
import parse from './parser.js';

const getProxyLinkPref = () => 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

export const inputHandler = (e, state) => {
  state.form.value = e.target.value;
};

export const submitHandler = (event, state, i18next) => {
  event.preventDefault();
  validate(event, state.rssList, i18next)
    .then((link) => axios.get(getProxyLinkPref() + encodeURIComponent(link)))
    .then(({ data }) => {
      const { status, contents } = data;

      if (_.has(status, 'error') || contents === null) {
        state.form.valid = false;
        state.form.error = i18next.t('error.notValidRss');

        return;
      }

      const dataParsed = parse(contents);

      if (dataParsed === null) {
        state.form.valid = false;
        state.form.error = i18next.t('error.notValidRss');

        return;
      }

      const feedId = _.uniqueId('feed_');
      const feed = { ...dataParsed.feed, link: status.url, id: feedId };
      const posts = dataParsed.posts.map((post) => ({ ...post, id: _.uniqueId('post_'), feedId }));

      state.form.valid = true;
      state.form.value = '';
      state.form.error = null;
      state.rssList.unshift(feed);
      state.postList.unshift(...posts);
    })
    .catch((exception) => {
      state.form.valid = false;
      state.form.error = exception.message;
    });
};

const postsLoad = (state) => {
  const promises = state.rssList.map(
    (feed) => axios.get(getProxyLinkPref() + encodeURIComponent(feed.link))
      .then((response) => ({ response, feed })),
  );

  return Promise.all(promises).then((responses) => {
    responses.forEach(({ feed, response }) => {
      const { data } = response;
      const { status, contents } = data;

      if (_.has(status, 'error') || contents === null) {
        return;
      }

      const dataParsed = parse(contents);

      if (dataParsed === null) {
        return;
      }

      const isIdentityPost = (oldPost, newPost) => (
        oldPost.title === newPost.title && oldPost.feedId === feed.id
      );
      const postFilter = (newPost) => (
        !state.postList.find((oldPost) => isIdentityPost(oldPost, newPost))
      );
      const posts = dataParsed.posts.filter(postFilter);

      if (posts.length > 0) {
        const postsPrepared = posts.map((post) => ({ ...post, id: _.uniqueId('post_'), feedId: feed.id }));
        state.postList.unshift(...postsPrepared);
      }
    });
  });
};

export const postsLoader = (state, timeout) => {
  setTimeout(() => {
    postsLoad(state).then(() => postsLoader(state, timeout));
  }, timeout);
};

export const postPreview = (e, state) => {
  const { postId } = e.target.dataset;
  state.uiState.viewedPosts.push(postId);
  state.uiState.vieingPost = postId;
};

export const modalCloseHandler = (state) => {
  state.uiState.vieingPost = null;
};
