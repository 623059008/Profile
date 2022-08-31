/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 14:38:15
 * @modify date 2022-08-31 14:38:15
 * @desc article template component
 */
import React, { useEffect, useState } from 'react';
import config from '../config.json';
import styles from '../styles/article.module.css';
import PropTypes from 'prop-types';

const Article = (props) => {
  const [content, setContent] = useState(null);
  const { data } = props;
  useEffect(() => {
    const content = config.articles[data] || null;
    setContent(content);
  }, [data]);
  return <div className={styles['article-container']}>{content}</div>;
};

Article.propTypes = {
  data: PropTypes.string.isRequired
}
export default Article;
