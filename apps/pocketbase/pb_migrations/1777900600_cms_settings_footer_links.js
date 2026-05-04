/// <reference path="../pb_data/types.d.ts" />
/// <summary>Add footer_nav and footer_social JSON arrays to cms_settings so the public footer can be edited from /admin/settings.</summary>
migrate((app) => {
  const col = app.findCollectionByNameOrId('cms_settings');

  const hasField = (name) => !!col.fields.getByName(name);

  if (!hasField('footer_nav')) {
    col.fields.add(
      new JSONField({
        name: 'footer_nav',
        required: false,
        maxSize: 100000,
      }),
    );
  }

  if (!hasField('footer_social')) {
    col.fields.add(
      new JSONField({
        name: 'footer_social',
        required: false,
        maxSize: 100000,
      }),
    );
  }

  return app.save(col);
}, (app) => {
  try {
    const col = app.findCollectionByNameOrId('cms_settings');
    col.fields.removeByName('footer_nav');
    col.fields.removeByName('footer_social');
    return app.save(col);
  } catch (e) {
    if (!String(e.message || e).includes('no rows in result set')) throw e;
  }
});
