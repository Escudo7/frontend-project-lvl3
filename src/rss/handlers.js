import axios from 'axios';
import _ from 'lodash';
import onChange from 'on-change';
import validate from './validation.js';
import parse from './parser.js';

const getProxyLinkPref = () => 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

export const submitHandler = (event, state, i18next) => {
  event.preventDefault();
  state.form.state = 'sending';
  validate(event, state.rssList, i18next)
    .then((link) => axios.get(getProxyLinkPref() + encodeURIComponent(link))
      .then((response) => ({ response, link }))
      .catch(() => {
        throw new Error(i18next.t('messages.netError'));
      }))
    .then(({ response, link }) => {
      const { data } = response;
      const { status, contents } = data;

      if (_.has(status, 'error') || contents === null) {
        throw new Error(i18next.t('messages.notValidRss'));
      }

      const dataParsed = parse(contents);

      if (dataParsed === null) {
        throw new Error(i18next.t('messages.notValidRss'));
      }

      const feedId = _.uniqueId('feed_');
      const feed = { ...dataParsed.feed, link, id: feedId };
      const posts = dataParsed.posts.map((post) => ({ ...post, id: _.uniqueId('post_'), feedId }));
      const { rssList, postList } = onChange.target(state);

      state.form.error = null;
      state.form.state = 'success';
      state.rssList = [feed, ...rssList];
      state.postList = [...posts, ...postList];
    })
    .catch((exception) => {
      state.form.error = exception.message;
      state.form.state = 'error';
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
        const postSaved = onChange.target(state).postList;
        state.postList = [...postsPrepared, ...postSaved];
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
  const { viewedPosts } = onChange.target(state).uiState;
  state.uiState.viewedPosts = [...viewedPosts, postId];
  state.uiState.viewingPost = postId;
};

export const modalCloseHandler = (state) => {
  state.uiState.vieingPost = null;
};
