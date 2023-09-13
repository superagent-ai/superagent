# Changelog

## [Unreleased][]

## [3.0.1][] - 2020-11-02

### Fixed

-   Accessing `package.json` being restricted since it’s no longer exported
    ([#43](https://github.com/niksy/throttle-debounce/pull/43))

## [3.0.0][] - 2020-10-28

### Changed

-   Avoid having bundles like Webpack load the UMD module
    ([#42](https://github.com/niksy/throttle-debounce/pull/42))
-   Upgrade package

### Removed

-   **Breaking**: Drop Node 8 support, package is no longer tested against it,
    but it should still work since there are no code changes

## [2.3.0][] - 2020-08-12

### Added

-   Support for UMD package
    ([#41](https://github.com/niksy/throttle-debounce/pull/41))

## [2.2.1][] - 2020-06-08

### Changed

-   Upgrade package
-   Add Browserstack testing
-   Add more detailed usage example to README
    ([#36](https://github.com/niksy/throttle-debounce/pull/36))
-   Use ES2015+ features

[2.2.1]: https://github.com/niksy/throttle-debounce/tree/v2.2.1
[2.3.0]: https://github.com/niksy/throttle-debounce/tree/v2.3.0
[unreleased]: https://github.com/niksy/throttle-debounce/compare/v2.3.0...HEAD
[unreleased]: https://github.com/niksy/throttle-debounce/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/niksy/throttle-debounce/tree/v3.0.0
[unreleased]: https://github.com/niksy/throttle-debounce/compare/v3.0.1...HEAD
[3.0.1]: https://github.com/niksy/throttle-debounce/tree/v3.0.1
