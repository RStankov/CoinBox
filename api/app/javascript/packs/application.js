/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

const Rails = require('rails-ujs');
Rails.start();

const _ = require('lodash');
const JSONEditor = require('jsoneditor');

_.each(document.querySelectorAll('[data-json-editor="true"]'), function(container) {
  const element = container.querySelector('div');
  const input = container.querySelector('input');

  const options = {
    modes: ['code'],
    onChange() {
      const data = silentJSON(editor);
      if (data !== null) {
        input.value = data;
      }
    }
  };

  const editor = new JSONEditor(element, options);
  editor.set(JSON.parse(input.value));
});

function silentJSON(editor) {
  try {
    return JSON.stringify(editor.get());
  } catch (e) {
    return null;
  }
}
