/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:50
 * @modify date 2022-08-31 13:00:50
 * @desc markdown preview component
 */
/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ColorLoading from '../colorLoading';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { handleUrl, externalValidator } from '../../util/url';
import config from '../../config';
import styles from '../../styles/editor.module.css';

const markdownConfig = config.markdown;

export default function MarkDownPreview (props) {
  const { markdownFile, markdownString, loading, showPreviewHeader = true, setPage } = props;
  const [markdownContent, setMarkdownContent] = useState('');
  useEffect(() => {
    setMarkdownContent(markdownString);
  }, [markdownString]);

  useEffect(() => {
    if (markdownFile) {
      fetch(markdownFile)
        .then((response) => response.text())
        .then((text) => {
          setMarkdownContent(text);
        });
    }
  }, [markdownFile])

  return (
    <div className={styles['markdown-preview-container']}>
    {showPreviewHeader && <h1>Markdown Preview</h1>}
    <div className={styles['preview-panel']} style={!showPreviewHeader ? { border: 0 } : {}}>
      {!markdownContent || loading
        ? <ColorLoading />
        : (
            <ReactMarkdown
              children={markdownContent}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                code ({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match
                    ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                      )
                    : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                      );
                },

                h1 ({ children, ...props }) {
                  return <><h1 {...props}>{children}</h1><hr /></>
                },

                h2 ({ children, ...props }) {
                  return <><h1 {...props}>{children}</h1><hr /></>
                },

                blockquote ({ children, ...props }) {
                  return <blockquote style={ { borderLeft: '3px solid #ddd', paddingLeft: '0.5em', color: '#bbb' } } {...props}>{children}</blockquote>
                },

                // custom the link behavior, all internal links will be loaded by setPage from App Component.
                // It's to avoid the influence from different deployment root directory.
                a ({ node, children, ...props }) {
                  // determine if the link is external or internal
                  return (
                    <a title={node?.properties?.href} style={!markdownConfig.linkUnderline ? { textDecoration: 'none' } : {}} onClick={() => handleUrl(node?.properties?.href, setPage)} {...props} href="#" >
                      {children}
                    </a>
                  );
                },
                // transform the image path to /resources/[absolute path].
                // In webpack.config.js, I add a rule to package all resources under /src/articles/ to /resources/ with original absolute path.
                // I won't suggest you put resources in your repository, but if you do, it can work with absolution path, not relative path because the relative path can not be parsed in reandering.
                // I suggest you put an image with external link like google drive.
                img ({ node, children, ...props }) {
                  if (externalValidator(node?.properties?.src)) {
                    // external link
                    return (<img style={{ width: 'auto', maxWidth: '100%' }} {...props}></img>)
                  }
                  const finalSrc = `/resources${node?.properties.src}`
                  return (
                    <img style={{ width: 'auto', maxWidth: '100%' }} title={node?.properties.alt} alt={node?.properties.alt} {...props} src={finalSrc}>{children}</img>
                  )
                }
              }}
            />
          )}
    </div>
    </div>
  );
}

MarkDownPreview.propTypes = {
  setPage: PropTypes.func.isRequired,
  markdownFile: PropTypes.string,
  markdownString: PropTypes.string,
  loading: PropTypes.bool,
  showPreviewHeader: PropTypes.bool
}
