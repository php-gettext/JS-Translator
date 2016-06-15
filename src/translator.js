(function (root, factory) {
    //amd
    if (typeof define === "function" && define.amd) {
        define(['sprintf'], function (sprintf) {
            return factory(sprintf.vsprintf);
        });

    //commonjs
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require('sprintf-js').vsprintf);

    //global
    } else {
        root.gettext = factory(window.vsprintf);
    }
}(this, function (vsprintf) {

    function Translator (translations) {
        this.dictionary = {};
        this.plurals = {};
        this.domain = null;

        if (translations) {
            this.loadTranslations(translations);
        }
    }

    Translator.prototype = {
        loadTranslations: function (translations) {
            var domain = translations.domain || '';

            if (this.domain === null) {
                this.domain = domain;
            }

            if (this.dictionary[domain]) {
                mergeTranslations(this.dictionary[domain], translations.messages);
                return this;
            }

            if (translations['plural-forms']) {
                var plural = translations['plural-forms'].split(';', 2);

                this.plurals[domain] = {
                    count: parseInt(plural[0].replace('nplurals=', '')),
                    code: plural[1].replace('plural=', 'return ') + ';'
                };
            }

            this.dictionary[domain] = translations.messages;

            return this;
        },

        defaultDomain: function (domain) {
            this.domain = domain;

            return this;
        },

        gettext: function (original) {
            return this.dpgettext(this.domain, null, original);
        },

        ngettext: function (original, plural, value) {
            return this.dnpgettext(this.domain, null, original, plural, value);
        },

        dngettext: function (domain, original, plural, value) {
            return this.dnpgettext(domain, null, original, plural, value);
        },

        npgettext: function (context, original, plural, value) {
            return this.dnpgettext(this.domain, context, original, plural, value);
        },

        pgettext: function (context, original) {
            return this.dpgettext(this.domain, context, original);
        },

        dgettext: function (domain, original) {
            return this.dpgettext(domain, null, original);
        },

        dpgettext: function (domain, context, original) {
            var translation = getTranslation(this.dictionary, domain, context, original);

            if (translation !== false && translation[0] !== '') {
                return translation[0];
            }

            return original;
        },

        dnpgettext: function (domain, context, original, plural, value) {
            var index = getPluralIndex(this.plurals, domain, value);
            var translation = getTranslation(this.dictionary, domain, context, original);

            if (translation[index] && translation[index] !== '') {
                return translation[index];
            }

            return (index === 0) ? original : plural;
        },

        __: function (original) {
            return format(
                this.gettext(original),
                Array.prototype.slice.call(arguments, 1)
            );
        },

        n__: function (original, plural, value) {
            return format(
                this.ngettext(original, plural, value),
                Array.prototype.slice.call(arguments, 3)
            );
        },

        p__: function (context, original) {
            return format(
                this.pgettext(context, original),
                Array.prototype.slice.call(arguments, 2)
            );
        },

        d__: function (domain, original) {
            return format(
                this.dgettext(domain, original),
                Array.prototype.slice.call(arguments, 2)
            );
        },

        dp__: function (domain, context, original) {
            return format(
                this.dgettext(domain, context, original),
                Array.prototype.slice.call(arguments, 3)
            );
        },

        np__: function (context, original, plural, value) {
            return format(
                this.npgettext(context, original, plural, value),
                Array.prototype.slice.call(arguments, 4)
            );
        },

        dnp__: function (domain, context, original, plural, value) {
            return format(
                this.dnpgettext(domain, context, original, plural, value),
                Array.prototype.slice.call(arguments, 5)
            );
        }
    };

    function getTranslation(dictionary, domain, context, original) {
        context = context || '';

        if (!dictionary[domain] || !dictionary[domain][context] || !dictionary[domain][context][original]) {
            return false;
        }

        return dictionary[domain][context][original];
    }

    function getPluralIndex(plurals, domain, value) {
        if (!plurals[domain]) {
            return value == 1 ? 0 : 1;
        }

        if (!plurals[domain].fn) {
            plurals[domain].fn = new Function('n', plurals[domain].code);
        }

        return plurals[domain].fn.call(this, value);
    }

    function mergeTranslations(translations, newTranslations) {
        for (var context in newTranslations) {
            if (!translations[context]) {
                translations[context] = newTranslations[context];
                continue;
            }

            for (var original in newTranslations[context]) {
                translations[context][original] = newTranslations[context][original];
            }
        }
    }

    function format (text, args) {
        if (!args.length) {
            return text;
        }

        if (args[0] instanceof Array) {
            return vsprintf(text, args[0]);
        }

        return vsprintf(text, args);
    }

    return Translator;
}));