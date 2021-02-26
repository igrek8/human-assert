const { compile, resolve } = require('human-assert');

const $ = (source, ctx) => console.log(resolve(compile({ source }), ctx).toString().padEnd(5) + ' -> ' + source);

$('admin in roles', { roles: ['admin'] });

$('not (suspended in groups) or (admin in roles)', { groups: ['suspended'], roles: ['customer'] });

$('(read:* write:comments) in permissions', { permissions: ['read:posts', 'write:comments'] });
