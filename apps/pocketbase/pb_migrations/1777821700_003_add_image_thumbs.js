/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // Add thumbnail presets to posts.featured_image and images.file
    try {
      const posts = app.findCollectionByNameOrId("posts");
      const fi = posts.fields.getByName("featured_image");
      if (fi) {
        fi.thumbs = ["100x100", "300x200", "800x500"];
        app.save(posts);
      }
    } catch (e) {
      console.log("Failed to update posts.featured_image thumbs:", e.message);
    }

    try {
      const images = app.findCollectionByNameOrId("images");
      const f = images.fields.getByName("file");
      if (f) {
        f.thumbs = ["100x100", "300x300", "800x600"];
        app.save(images);
      }
    } catch (e) {
      console.log("Failed to update images.file thumbs:", e.message);
    }
  },
  (app) => {
    try {
      const posts = app.findCollectionByNameOrId("posts");
      const fi = posts.fields.getByName("featured_image");
      if (fi) {
        fi.thumbs = [];
        app.save(posts);
      }
    } catch {
      // ignore
    }
    try {
      const images = app.findCollectionByNameOrId("images");
      const f = images.fields.getByName("file");
      if (f) {
        f.thumbs = [];
        app.save(images);
      }
    } catch {
      // ignore
    }
  }
);
