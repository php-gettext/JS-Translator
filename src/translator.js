export default class Translator {
    constructor(translations) {
        this.dictionary = {};
        this.plurals = {};
        this.domain = undefined;

        if (translations) {
            this.loadTranslations(translations);
        }
    }

    loadTranslations(translations) {
        const domain = translations.domain || '';

        if (this.domain === undefined) {
            this.domain = domain;
        }

        if (this.dictionary[domain]) {
            mergeTranslations(this.dictionary[domain], translations.messages);
            return this;
        }

        if (translations.fn) {
            this.plurals[domain] = { fn: translations.fn };
        } else if (translations['plural-forms']) {
            const plural = translations['plural-forms'].split(';', 2);

            this.plurals[domain] = {
                count: parseInt(plural[0].replace('nplurals=', '')),
                code: plural[1].replace('plural=', 'return ') + ';'
            };
        }

        this.dictionary[domain] = translations.messages;

        return this;
    }

    defaultDomain(domain) {
        this.domain = domain;
        return this;
    }

    gettext(original, ...args) {
        return this.format(this.translate(undefined, undefined, original), ...args);
    }

    ngettext(original, plural, counter, ...args) {
        return this.format(this.translatePlural(undefined, undefined, original, plural, counter), ...args);
    }

    dngettext(domain, original, plural, counter, ...args) {
        return this.format(this.translatePlural(domain, undefined, original, plural, counter), ...args);
    }

    npgettext(context, original, plural, counter, ...args) {
        return this.format(this.translatePlural(undefined, context, original, plural, counter), ...args);
    }

    pgettext(context, original, ...args) {
        return this.format(this.translate(undefined, context, original), ...args);
    }

    dgettext(domain, original, ...args) {
        return this.format(this.translate(domain, undefined, original), ...args);
    }

    dpgettext(domain, context, original, ...args) {
        return this.format(this.translate(domain, context, original), ...args);
    }

    dnpgettext(domain, context, original, plural, counter, ...args) {
        return this.format(this.translatePlural(domain, context, original, plural, counter), ...args);
    }

    __(original, ...args) {
        return this.gettext(original, ...args);
    }

    n__(original, plural, value, ...args) {
        return this.ngettext(original, plural, value, ...args);
    }

    p__(context, original, ...args) {
        return this.pgettext(context, original, ...args);
    }

    d__(domain, original, ...args) {
        return this.dgettext(domain, original, ...args);
    }

    dp__(domain, context, original, ...args) {
        return this.dpgettext(domain, context, original, ...args);
    }

    np__(context, original, plural, value, ...args) {
        return this.npgettext(context, original, plural, value, ...args);
    }

    dnp__(domain, context, original, plural, value, ...args) {
        return this.dnpgettext(domain, context, original, plural, value, ...args);
    }

    format(text, ...args) {
        if (!args.length) {
            return text;
        }

        if (typeof args[0] === 'object') {
            Object.keys(args[0]).forEach(search => {
                text = text.replace(search, args[0][search]);
            });

            return text;
        }

        return text.replace(/(%[sd])/g, function(match) {
            if (!args.length) {
                return match;
            }

            switch (match) {
                case '%s':
                    return args.shift();

                case '%d':
                    return parseFloat(args.shift());
            }
        });
    }

    translate(domain, context, original) {
        const translation = this.getTranslation(domain, context, original);

        return translation && translation[0] ? translation[0] : original;
    }

    translatePlural(domain, context, original, plural, counter) {
        const translation = this.getTranslation(domain, context, original);
        const index = this.getPluralIndex(domain, counter);

        return translation && translation[index] ? translation[index] : index === 0 ? original : plural;
    }

    getTranslation(domain, context, original) {
        domain = domain || this.domain;
        context = context || '';

        if (
            !this.dictionary[domain] ||
            !this.dictionary[domain][context] ||
            !this.dictionary[domain][context][original]
        ) {
            return undefined;
        }

        const translation = this.dictionary[domain][context][original];

        return Array.isArray(translation) ? translation : [translation];
    }

    getPluralIndex(domain, value) {
        domain = domain || this.domain;

        if (!this.plurals[domain]) {
            return value == 1 ? 0 : 1;
        }

        if (!this.plurals[domain].fn) {
            this.plurals[domain].fn = new Function('n', this.plurals[domain].code);
        }

        return this.plurals[domain].fn.call(this, value) + 0;
    }
}

function mergeTranslations(translations, newTranslations) {
    for (let context in newTranslations) {
        if (!translations[context]) {
            translations[context] = newTranslations[context];
            continue;
        }

        for (let original in newTranslations[context]) {
            translations[context][original] = newTranslations[context][original];
        }
    }
}
