var CompositeDisposable = require('atom').CompositeDisposable
var uuid = require('node-uuid').v4
var sh = require('child_process').spawnSync;

// valid if it contains a hex letter and a number and is unused in the project
function validHash(hash) {
  var wellFormed = (/[a-f]/.exec(hash) && /\d/.exec(hash));

  var unused = (1 === sh('git', ['grep', hash, '--', '*.less', '*.css'], {cwd: atom.project.getPaths()[0]}).status);

  return wellFormed && unused;
}

// gen hash from first five characters of a UUIDv4
function genHash() {
  var hash;
  do {
    hash = uuid().substr(0,5);
  } while (!validHash(hash));
  return hash;
}

module.exports = {
  activate: function (){
    atom.commands.add('atom-text-editor', 'atom-snowflake-css:insertHash', this.insertHash);
    atom.commands.add('atom-text-editor', 'atom-snowflake-css:insertHashAndCopy', this.insertHashAndCopy);
  },

  insertHash: function (){
    var editor = atom.workspace.getActiveTextEditor();
    var hash = genHash();

    editor.insertText(hash);
  },

  insertHashAndCopy: function (){
    var editor = atom.workspace.getActiveTextEditor();
    var hash = genHash();

    editor.insertText(hash);
    atom.clipboard.write(hash);
  }
};
