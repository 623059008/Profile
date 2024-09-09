/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:40:35
 * @modify date 2023-03-05 19:13:49
 * @desc App
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import config from './config';
import Article from './components/article';
import MarkDownEditor from './components/editor/editor';
import NewEditor from './components/editor/slashEditor/slashEditor';
import Header from './components/header';
import { getUrlParameters, formatPage } from './util/url';
import { compareLowerCase } from './util/str';
import { navigate, goBack, selectHistory, selectPage } from './util/store'
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const { debug } = config;

const App = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectPage);
  const history = useSelector(selectHistory);
  const popstateHandler = (e) => {
    // click the goBack button on browser
    // go back to the previous page in history list.
    dispatch(goBack());
  }
  useEffect(() => {
    debug && console.log('[debug] component reload as page: ', page);
    window.addEventListener('popstate', popstateHandler);
    // set document title
    document.title = config.title;

    // url param navigation
    const params = getUrlParameters() || {};
    // internal links
    if (!params.page || params.page === page) {
      return;
    }
    dispatch(navigate(params.page));
  }, []);

  return (
      <div className='page'>
        <Header />
        <div className='main-container'>
          {!config.markdown.enable
            ? <Article />
            : (compareLowerCase(page, 'Markdown')
                ? <NewEditor />
                : <Article />)
          }
        </div>
      </div>
  );
};

export default App;
