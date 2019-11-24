# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.1] - 2019-11-24
### Added
- Support for UMD [#5]

### Fixed
- Tests

## [3.0.0] - 2019-11-03
### Added
- Support for ES6 modules.
- The long functions (gettext, ngettext, etc) supports arguments to format the result (before, only short functions __, n__, etc had this)
- You can use objects to format the text by search and replace. For example: `t.gettext('Hello _world', {_world: 'World'})`

### Removed
- Support for AMD and Global js.
- Sprintf dependency by default. Now the library has a (very) limited sprintf implementation but open to extend and improved.

## 2.1.0 - 2018-06-12
### Added
- Allow to include the plural function in the translations to prevent CSP errors [#4]

[#4]: https://github.com/php-gettext/gettext-translator/issues/4
[#5]: https://github.com/php-gettext/gettext-translator/issues/5

[3.0.1]: https://github.com/php-gettext/gettext-translator/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/php-gettext/gettext-translator/compare/v2.1.0...v3.0.0
