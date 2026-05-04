/// <reference path="../pb_data/types.d.ts" />
/// <summary>Bootstrap an initial admin user from env vars (PB_ADMIN_USER_EMAIL/PB_ADMIN_USER_PASSWORD). No-ops if either is missing — credentials are NEVER hard-coded here.</summary>
migrate((app) => {
  const email = $os.getenv("PB_ADMIN_USER_EMAIL");
  const password = $os.getenv("PB_ADMIN_USER_PASSWORD");
  if (!email || !password) {
    console.log("PB_ADMIN_USER_EMAIL / PB_ADMIN_USER_PASSWORD not set, skipping admin user bootstrap");
    return;
  }

  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", email);
  record.setPassword(password);
  record.set("name", "Admin");
  record.set("role", "admin");
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Admin user already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  const email = $os.getenv("PB_ADMIN_USER_EMAIL");
  if (!email) return;
  try {
    const record = app.findFirstRecordByData("users", "email", email);
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
});
