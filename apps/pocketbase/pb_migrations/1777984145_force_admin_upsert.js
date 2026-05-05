/// <reference path="../pb_data/types.d.ts" />
/// <summary>Force-resync admin user from env vars (PB_ADMIN_USER_EMAIL/PB_ADMIN_USER_PASSWORD). Normalizes email (trim+lowercase), upserts users row, sets password/role/name/verified. No-ops if either env is missing — credentials are NEVER hard-coded here.</summary>
migrate((app) => {
  const rawEmail = $os.getenv("PB_ADMIN_USER_EMAIL");
  const password = $os.getenv("PB_ADMIN_USER_PASSWORD");
  if (!rawEmail || !password) {
    console.log("force_admin_upsert: PB_ADMIN_USER_EMAIL / PB_ADMIN_USER_PASSWORD not set, skipping");
    return;
  }
  const email = String(rawEmail).trim().toLowerCase();

  let record;
  let action = "updated";
  try {
    record = app.findFirstRecordByData("users", "email", email);
  } catch (e) {
    if (!String(e.message || e).includes("no rows in result set")) {
      throw e;
    }
    const collection = app.findCollectionByNameOrId("users");
    record = new Record(collection);
    record.set("email", email);
    action = "created";
  }

  record.setPassword(password);
  record.set("role", "admin");
  record.set("name", "Admin");
  record.set("verified", true);
  app.save(record);
  console.log(`force_admin_upsert: ${action} admin user (email=${email})`);
}, () => {
  // no-op rollback for auth bootstrap helper
});
