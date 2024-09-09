/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-08-31 13:00:28
 * @modify date 2022-08-31 13:00:28
 * @desc markdown editor component
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Link from '@editorjs/link';
import RawTool from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import CheckList from '@editorjs/checklist';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'
import config from '../../../config';

import styles from './slash-editor.css';

const markdownConfig = config.markdown;

export class ClientEditorCore {
  constructor ({ tools, ...config }) {
    const extendTools = {
      // default tools
      // paragraph: {
      //   class: Paragraph,
      //   inlineToolbar: true,
      // },
      ...tools,
    };

    this._editorJS = new EditorJS({
      tools: extendTools,
      ...config,
    });
  }

  get dangerouslyLowLevelInstance () {
    return this._editorJS;
  }

  async clear () {
    await this._editorJS.clear();
  }

  async save () {
    return this._editorJS.save();
  }

  async destroy () {
    await this._editorJS.isReady;
    await this._editorJS.destroy();
  }

  async render (data) {
    await this._editorJS.render(data);
  }
}

export function SlashDownEditorCore ({
  holder,
  children,
  value,
  defaultValue,
  onInitialize,
  ...restProps
}) {
  const factory = useCallback(
    (config) => new ClientEditorCore(config),
    []
  );
  const memoizedHolder = useRef(
    holder ?? `react-editor-js-${Date.now().toString(16)}`
  );
  const editorJS = React.useRef(null);
  useEffect(() => {
    editorJS.current = factory({
      holder: memoizedHolder.current,
      ...(defaultValue && { data: defaultValue }),
      ...restProps,
    })

    onInitialize?.(editorJS.current)

    return () => {
      editorJS.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (value) {
      editorJS.current?.render(value)
    }
  }, [value])
  return children || <div id={memoizedHolder.current} />;
}

SlashDownEditorCore.propTypes = {
  holder: PropTypes.string,
  children: PropTypes.element,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  onInitialize: PropTypes.func,
};

export default function SlashDownEditor () {
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'slashEditor',
      tools: {
        header: {
          class: Header,
          shortcut: 'CMD+SHIFT+H',
        },
        linkTool: {
          class: Link,
          shortcut: 'CMD+K',
        },
        raw: RawTool,
        image: {
          class: SimpleImage,
          inlineToolbar: true,
        },
        checklist: {
          class: CheckList,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              facebook: true,
              twitter: true,
              youtube: true,
              coub: true,
              twitch: true,
              vimeo: true,
              vine: true,
              codepen: true,
              pinterest: true,
            },
          },
        },
        quote: Quote,
      },
      placeholder: 'Let`s write an awesome story!',
      autofocus: true,
    });
    console.log('[debug] init editor')
    return () => {
      console.log('[debug] destroy editor')
      // delete editor
      if (editor && editor.destroy) {
        editor.destroy();
      }
      // delete dom with id slashEditor
      const slashEditor = document.getElementById('slashEditor');
      if (slashEditor) {
        slashEditor.parentNode.removeChild(slashEditor);
      }
    }
  }, []);
  return <SlashDownEditorCore holder="slashEditor"></SlashDownEditorCore>
}
SlashDownEditor.propTypes = {};
