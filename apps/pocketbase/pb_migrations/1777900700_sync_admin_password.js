/// <reference path="../pb_data/types.d.ts" />
/// <summary>Re-sync the admin user's password/role/name from env vars (PB_ADMIN_USER_EMAIL/PB_ADMIN_USER_PASSWORD). No-ops if either is missing — credentials are NEVER hard-coded here.</summary>
migrate((app) => {
  const email = $os.getenv("PB_ADMIN_USER_EMAIL");
  const password = $os.getenv("PB_ADMIN_USER_PASSWORD");
  if (!email || !password) {
    console.log("PB_ADMIN_USER_EMAIL / PB_ADMIN_USER_PASSWORD not set, skipping admin password sync");
    return;
  }

  try {
    const record = app.findFirstRecordByData("users", "email", email);
    record.setPassword(password);
    record.set("role", "admin");
    record.set("name", "Admin");
    return app.save(record);
  } catch (e) {
    if (String(e.message || e).includes("no rows in result set")) {
      const collection = app.findCollectionByNameOrId("users");
      const record = new Record(collection);
      record.set("email", email);
      record.setPassword(password);
      record.set("name", "Admin");
      record.set("role", "admin");
      return app.save(record);
    }
    throw e;
  }
}, () => {
  // no-op rollback for auth bootstrap helper
});
