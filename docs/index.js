const { compile, resolve } = require('human-assert');

const $ = (source, ctx) => resolve(compile({ source }), ctx);

$('admin in roles', {
  roles: ['admin'],
});

$('not (suspended in groups) or (admin in roles)', {
  groups: ['suspended'],
  roles: ['customer'],
});

$('(read:posts write:comments) in permissions', {
  permissions: ['read:posts', 'write:comments'],
});

$('moderator:* in roles', {
  roles: ['moderator:1'],
});
