# Gettext translator

Javascript gettext translator. Use [gettext/gettext](https://github.com/oscarotero/Gettext) PHP library to generate and modify the messages.

Supports:

* AMD
* CommonJS
* Global js

## Installation

```
npm install gettext-translator
```

## Usage

Use the Json generator of the [gettext/gettext](https://github.com/oscarotero/Gettext) library to export the translations to json:

```php
use Gettext\Translations;

//Load the po file with the translations
$translations = Translations::fromPoFile('locales/gl.po');

//Export to a json file
$translations->toJsonFile('locales/gl.json');
```

Load the json file in your browser (for example, using webpack) and use it

```js
var Translator = require('gettext-translator');
var translations = require('locales/gl.json');

var i18n = new Translator(translations);

console.log(i18n.gettext('hello world')); //ola mundo
```

## Sprintf

This library includes [sprintf](https://github.com/alexei/sprintf.js) dependency implemented in the short methods like `__`, `n__`, etc...:

```js
i18n.__('Hello %s', 'world'); //Hello world
i18n.n__('One comment', '%s comments', 12, 12); //12 comments
```

## API

Long method | Short + sprintf | description
------ | ----- | -----------
gettext | __ | Returns a translation
ngettext | n__ | Returns a translation with singular/plural variations
dngettext | dn__ | Returns a translation with domain and singular/plural variations
npgettext | np__ | Returns a translation with context and singular/plural variations
pgettext | p__ | Returns a translation with a specific context
dgettext | d__ | Returns a translation with a specific domain
dpgettext | dp__ | Returns a translation with a specific domain and context
dnpgettext | dnp__ | Returns a translation with a specific domain, context and singular/plural variations
