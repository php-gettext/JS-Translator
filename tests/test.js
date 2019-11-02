import assert from 'assert';
import Translator from '../src/translator.js';

import translations1 from './translations.json';
import translations2 from './translations2.json';
import translations3 from './translations3.json';

const sprintf = require('sprintf-js');

const translator = new Translator(translations1);
translator.loadTranslations(translations2);
translator.vsprintf = sprintf.vsprintf;

describe('Basic functions', function() {
    it('gettext', function() {
        assert.equal('vaca', translator.gettext('cow'));
    });

    it('ngettext', function() {
        assert.equal('un arquivo', translator.ngettext('one file', '%s files', 1));
        assert.equal('%s arquivos', translator.ngettext('one file', '%s files', 0));
        assert.equal('%s arquivos', translator.ngettext('one file', '%s files', 2));
    });
});

describe('Formatter functions', function() {
    it('__', function() {
        assert.equal('this is a cow', translator.__('this is a :animal', { ':animal': 'cow' }));
    });

    it('n__', function() {
        assert.equal('un arquivo', translator.n__('one file', '%s files', 1, 1));
        assert.equal('0 arquivos', translator.n__('one file', '%s files', 0, 0));
        assert.equal('2 arquivos', translator.n__('one file', '%s files', 2, 2));
    });
});

describe('custom plural functions', function() {
    let called = false;

    translations3.fn = function(n) {
        called = true;
        return 2;
    };

    translator.loadTranslations(translations3);

    it('should return always the second plural', function() {
        assert.equal('foo 3', translator.dngettext('foo', 'foo x', 'foo y', 0));
        assert.equal('foo 3', translator.dngettext('foo', 'foo x', 'foo y', 1));
        assert.equal('foo 3', translator.dngettext('foo', 'foo x', 'foo y', 2));
        assert.equal('foo 3', translator.dngettext('foo', 'foo x', 'foo y', 3));
    });

    it('the custom function was called', function() {
        assert(called, 'The custom function was not called');
    });
});
