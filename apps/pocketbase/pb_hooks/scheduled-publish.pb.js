/// <reference path="../pb_data/types.d.ts" />

// Promote scheduled posts whose scheduled_at has passed into "published" status.
// Runs every 5 minutes.
cronAdd("scheduledPublishCheck", "*/5 * * * *", () => {
  try {
    const now = new Date().toISOString();
    const records = $app.findRecordsByFilter(
      "posts",
      `status = "scheduled" && scheduled_at != "" && scheduled_at <= "${now}"`,
      "-scheduled_at",
      100
    );

    if (!records || records.length === 0) {
      return;
    }

    for (const rec of records) {
      try {
        rec.set("status", "published");
        if (!rec.get("published_at")) {
          rec.set("published_at", new Date().toISOString());
        }
        $app.save(rec);
        $app.logger().info("Auto-published scheduled post", "id", rec.get("id"), "title", rec.get("title"));
      } catch (err) {
        $app.logger().error("Failed to auto-publish scheduled post", "id", rec.get("id"), "error", String(err));
      }
    }
  } catch (err) {
    $app.logger().error("scheduledPublishCheck failed", "error", String(err));
  }
});
