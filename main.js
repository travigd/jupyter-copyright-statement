define([
  'jquery',
  'base/js/namespace',
  'base/js/utils',
  'services/config',
],
function ($, Jupyter, utils, config) {
"use strict";

/**
 * Configuration defaults.
 * nbconfig/copyright_statement.json takes priority.
 */
const config_defaults = {
  'text': 'All materials are copyright their respective owners. ' + 
          'All rights reserved.',
}


/**
 * Return a promise that resolves when the config is loaded.
 * Also includes default values.
 *
 * Further use of the ConfigWithDefaults should use get_sync.
 */
let get_config = function() {
  let config_section = new config.ConfigSection('copyright_statement', {
    base_url: utils.get_body_data("baseUrl")
  });
  // return a promise that resolves when the config section is loaded
  return new Promise((resolve, reject) => {
    config_section.load()
      .then(() => {
        resolve(new config.ConfigWithDefaults(config_section, config_defaults));
      })
      .catch((error) => {
        // if load generates an error it (probably) means that there was no
        // config file; we will just use defaults then
        resolve(new config.ConfigWithDefaults(config_section, config_defaults));
      });
  });
};


/**
 * Add the notice to the top of the notebooks/files tab.
 */
let add_copyright_notice = function(text) {
  $("#notebooks").prepend($('<p />', {
    text: text,
    style: 'color: #444; margin: 15px 0px; text-align: center; padding: 0 20px;',
  }));

}


/**
 * Tracker to count how many times we've deferred loading (due to
 * Jupyter.notebook_list being undefiend). When it hits zero, we give up.
 */
let n_retries = 6;


/**
 * Jupyter nbextension entrypoint.
 * Abort if we're not in tree mode. We also account for the possibility that
 * the tree view isn't loaded when this entrypoint function is run.
 */
let load_ipython_extension = function() {
  if (Jupyter.notebook !== undefined) {
    console.error(
      "copyright-statement nbextension should only be loaded for tree view");
    return;
  } else if (Jupyter.notebook_list === undefined) {
    if (n_retries == 0) {
      console.error(
        "Unable to load copyright-statement nbextension; timed out waiting " +
        "for Jupyter.notebook_list.");
      return;
    }
    n_retries -= 1;
    console.log("notebook_list undefined; trying again in 500ms...");
    setTimeout(load_ipython_extension, 500);
  }
  get_config().then((config) => {
    add_copyright_notice(config.get_sync('text'));
  });
};

return {load_ipython_extension: load_ipython_extension};

});
