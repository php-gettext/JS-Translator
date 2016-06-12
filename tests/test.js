var assert = require('assert');
var Translator = require(__dirname + '/../src/translator');

var i18n = new Translator(require(__dirname + '/translations.json'));
i18n.loadTranslations(require(__dirname + '/translations2.json'));

describe('Basic functions', function() {
    it('gettext', function () {
        assert.equal('vaca', i18n.gettext('cow'));
    });

    it('ngettext', function () {
        assert.equal('un arquivo', i18n.ngettext('one file', '%s files', 1));
        assert.equal('%s arquivos', i18n.ngettext('one file', '%s files', 0));
        assert.equal('%s arquivos', i18n.ngettext('one file', '%s files', 2));
    });
});

describe('vsprintf functions', function() {
    it('__', function () {
        assert.equal('vaca', i18n.__('cow'));
    });

    it('n__', function () {
        assert.equal('un arquivo', i18n.n__('one file', '%s files', 1, 1));
        assert.equal('0 arquivos', i18n.n__('one file', '%s files', 0, 0));
        assert.equal('2 arquivos', i18n.n__('one file', '%s files', 2, 2));
    });
});
