const path = require('path');

module.exports = {
    pagePerSection: true,
    sections: [
        { name: 'Principal', content:'docs/main.md'},
        { name: 'Main', components: 'src/App/**/*.js' },
        { name: 'Containers', components: 'src/containers/*.jsx' },
        { name: 'Components', components: 'src/components/**/*.jsx' },
        { name: 'Helpers', components: 'src/helpers/*.js' },
    ]
};