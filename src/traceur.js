// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function () {
  function compileAll() {
    // Code to handle automatically loading and running all scripts with type
    // text/traceur after the DOMContentLoaded event has fired.
    var scriptsToRun = [];
    var numPending = 0;

    function compileScriptsIfNonePending() {
      if (numPending == 0) {
        compileScripts();
      }
    }

    window.addEventListener('DOMContentLoaded', function() {
      var scripts = document.scripts;

      if (scripts.length <= 0) {
        return; // nothing to do
      }

      /* TODO: add traceur runtime library here
      scriptsToRun.push(
        { scriptElement: null,
          parentElement: scripts[0].parentElement,
          name: 'Runtime Library',
          contents: runtime });
      */

      for (var i = 0, length = scripts.length; i < length; i++) {
        var script = scripts[i];
        if (script.type == 'text/traceur' && !script.$jsppLoaded) {
          var entry = {
             scriptElement: script,
             parentElement: script.parentElement,
             name: script.src,
             contents: ''
          };

          scriptsToRun.push(entry);
          if (script.src.length == 0) {
            entry.contents = script.textContent;
            entry.name = document.location + ':' + i;
          } else {
            function loadFile(boundEntry) {
              numPending++;
              var xhr = new XMLHttpRequest();
              xhr.open('GET', script.src);
              xhr.addEventListener('load', function(e) {
                if (xhr.status == 200 || xhr.status == 0) {
                  boundEntry.contents = xhr.responseText;
                }
                numPending--;
                compileScriptsIfNonePending();
              });
              var onFailure = function() {
                numPending--;
                console.warn('Failed to load', script.src);
                compileScriptsIfNonePending();
              };
              xhr.addEventListener('error', onFailure);
              xhr.addEventListener('abort', onFailure);
              xhr.send();
            };
            loadFile(entry);
          }
        }
      }
      compileScriptsIfNonePending();
    });

    function compileScripts() {
      for (var i = 0; i < scriptsToRun.length; i++) {
        var entry = scriptsToRun[i];
        // TODO: invoke compiler here
        var result = entry.contents;

        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-traceur-src-url', entry.name);
        scriptElement.textContent = result;

        var parent = entry.parentElement;
        parent.insertBefore(scriptElement,
                            entry.scriptElement || parent.getFirstChild());
      }
    }
  }
  compileAll();
})();