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

const t = await getTranslator();

t.gettext('hello world'); //ola mundo
```

## Variables

You can add variables to the translations. For example:

```js
t.gettext('hello :who', {':who': 'world'}); //ola world
```

There's also a basic support o sprintf (only `%s` and `%d`)

```js
t.gettext('hello %s', 'world'); //ola world
```

To customize the translator formatter, just override the `format` method:

```js
t.format = function (text, ...args) {
    //Your custom format here
}
```

## Short names

Like in the [php version](https://github.com/php-gettext/Translator), there are the `__` functions that are alias of the long version:

```js
//Both functions does the same

t.gettext('Foo');
t.__('Foo');
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
