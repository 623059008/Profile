/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:21:40
 * @modify date 2022-09-03 20:40:16
 * @desc format link
 */
import config from '../config';
// describe how to format a link.
export function formatLink (link) {
  return `?page=${link}`;
}

// convert page to relative path of the articles
export function formatPage (page) {
  if (!page) return '';
  let path = page;
  // if the tail is not .md, add it.
  if (!page.match(/\.md$/)) {
    path = page + '.md';
  }
  // if the head is not ./, add it.
  if (!page.match(/^\.\//)) {
    path = './' + path;
  }
  return path;
}

export function getUrlParameters () {
  const query = window.location.search.substring(1);
  const params = {}
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    params[pair[0]] = pair[1];
  }
  return params;
}

// @setPage - state updater in App component, handle internal resources dynamically loading.
export function handleUrl (url, setPage) {
  // if the url is a header, load it directly.
  const inHeaders = config.headers.filter(item => item.title === url || item.customUrl === url)
  if (inHeaders.length > 0) {
    setPage(url);
    return;
  }
  // check if the url is the same domain, if not, open in new tab, otherwise open in same tab.
  // same domain url refers to an internal markdown document
  // for example, /?page=Projects/project1.md, ?page=About.md, /?page=Blog.md
  // if setPage is null, can not handle the url as internal resources.
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('www') || !url.match(/(^\?|^\/)/) || !setPage) {
    window.open(url, '_blank');
    return
  }
  if (url.indexOf('?') === -1 || url.split('?').length <= 1) {
    // no url params, if it is not an external link, it may refer to a title
    // directly setPage, the article component will handle the path.
    setPage(url)
    return
  }

  const query = url.split('?')[1];
  const params = {}
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    params[pair[0]] = pair[1];
  }
  setPage(params.page)
}
