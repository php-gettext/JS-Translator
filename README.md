# Gettext translator

Javascript gettext translations replacement to use with [gettext/gettext](https://github.com/php-gettext/Gettext). Use [gettext/json](https://github.com/php-gettext/Json) to generate the json data.

## Installation

```
npm install gettext-translator
```

## Usage

Use the Json generator [gettext/json](https://github.com/php-gettext/Json) library to export the translations to json:

```php
use Gettext\Loader\PoLoader;
use Gettext\Generator\JsonGenerator;

//Load the po file with the translations
$translations = (new PoLoader())->loadFile('locales/gl.po');

//Export to a json file
(new JsonGenerator())->generateFile('locales/gl.json');
```

Load the json file in your browser

```js
import Translator from 'gettext-translator';

async function getTranslator() {
    const response = await fetch('locales/gl.json');
    const translations = await response.json();

    return new Translator(translations);
}

const translator = await getTranslator();

translator.gettext('hello world'); //ola mundo
```

## Variables

You can add variables to the translations. For example:

```js
translator.gettext('hello :who', {':who': 'world'}); //ola world
```

To use vsprintf, just install one of the available implementations, for example [sprintf](https://github.com/alexei/sprintf.js) and assign the function as the value of `vsprintf` property.

```js
const sprintf = require('sprintf-js);

translator.vsprintf = sprintf.vsprintf;

translator.gettext('Hello %s', 'world'); //Hello world
translator.ngettext('One comment', '%s comments', 12, 12); //12 comments
```

## Short names

Like in the [php version](https://github.com/php-gettext/Translator), there are the `__` functions that are alias of the long version:

```js
//Both functions does the same

translator.gettext('Foo');
translator.__('Foo');
```

## API

Long name  | Short name | Description
-----------| -----------| -----------
gettext    | __         | Returns a translation
ngettext   | n__        | Returns a translation with singular/plural variations
dngettext  | dn__       | Returns a translation with domain and singular/plural variations
npgettext  | np__       | Returns a translation with context and singular/plural variations
pgettext   | p__        | Returns a translation with a specific context
dgettext   | d__        | Returns a translation with a specific domain
dpgettext  | dp__       | Returns a translation with a specific domain and context
dnpgettext | dnp__      | Returns a translation with a specific domain, context and singular/plural variations
