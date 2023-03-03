/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:21:40
 * @modify date 2023-03-02 18:44:43
 * @desc format link
 */
import config from '../config';

const { debug } = config;

// describe how to format a link.
export function formatLink (link) {
  return `?page=${link}`;
}

// check a string starts with '/', if not, add '/' to it.
export function slashStart (s) {
  if (s.startsWith('/')) {
    return s;
  }
  return '/' + s;
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

// a weak external validation
export const externalValidator = (url) => {
  // url is undefined
  if (!url) return false;
  const externalPrefixList = ['http', 'https', 'www', 'ftp', 'mailto', 'tel', 'ssh', 'git', 'data:'];
  return externalPrefixList.filter((prefix) => url.startsWith(prefix)).length > 0;
}

// @setPage - state updater in App component, handle internal resources dynamically loading.
export function handleUrl (url, setPage) {
  // parameters validation
  if (!setPage || !url) {
    console.error('[ERROR] setPage is not defined on /src/util/url.js:handleUrl');
    return
  }
  // for external links, open it in a new tab.
  if (externalValidator(url)) {
    debug && console.log('[debug][1] jump to external link:', url);
    window.open(url, '_blank');
    return
  }
  // if the url is a header, load it directly.
  const inHeaders = config.headers.filter(item => item.title === url || item.customUrl === url)
  if (inHeaders.length > 0) {
    debug && console.log('[debug][2] jump to headers page:', url);
    setPage(url);
    return;
  }
  // check if the url is the same domain, if not, open in new tab, otherwise load by setPage.
  // same domain url refers to an internal markdown document
  // for example, /?page=Projects/project1.md, ?page=About.md, /?page=Blog.md
  // if setPage is null, can not handle the url as internal resources.
  if (!url.match(/(^\?|^\/)/)) {
    debug && console.log('[debug][3] jump to external link:', url);
    window.open(url, '_blank');
    return
  }
  if (url.indexOf('?') === -1 || url.split('?').length <= 1) {
    // no url params, if it is not an external link, it may refer to a title
    // directly setPage, the article component will handle the path.
    debug && console.log('[debug][4] jump to internal page with title:', url);
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
  debug && console.log('[debug][5] jump to internal page with page param:', url);
  setPage(params.page)
}
