import _ from 'lodash';

export default (contents) => {
  const parser = new DOMParser();
  const dataParsed = parser.parseFromString(contents, 'application/xml');
  const errorNode = dataParsed.querySelector('parsererror');

  if (errorNode) {
    throw new Error('not valid xml');
  }

  const feedTitle = dataParsed.querySelector('channel title')?.textContent;
  const feedDescription = dataParsed.querySelector('channel description')?.textContent;
  const feedId = _.uniqueId('feed_');
  const feed = {
    id: feedId,
    title: feedTitle,
    description: feedDescription,
  };

  const posts = Array.from(dataParsed.querySelectorAll('item')).map((itemElement) => {
    const postTitle = itemElement.querySelector('title')?.textContent;
    const postDescription = itemElement.querySelector('description')?.textContent;
    const postLink = itemElement.querySelector('link')?.textContent;
    const postId = _.uniqueId('post_');

    return {
      id: postId,
      feedId,
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
  });

  return { feed, posts };
};
