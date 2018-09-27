"use strict";

const loopback = require("loopback");
const promisify = require("util").promisify;
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require("mkdirp"));
const DATASOURCE_NAME = "jakods";
const dataSourceConfig = require("./server/datasources.json");
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

async function discover() {
  // It's important to pass the same "options" object to all calls
  // of dataSource.discoverSchemas(), it allows the method to cache
  // discovered related models
  const options = {
    relations: true
  };

  // Discover models and relations
  const roleSchemas = await db.discoverSchemas("Role", options);
  const typepaymentSchemas = await db.discoverSchemas("TypePayment", options);
  const languageSchemas = await db.discoverSchemas("Language", options);
  const userlanguageSchemas = await db.discoverSchemas("UserLanguage", options);
  const paymentmethodSchemas = await db.discoverSchemas(
    "PaymentMethod",
    options
  );
  const userSchemas = await db.discoverSchemas("User", options);
  const userRoleSchemas = await db.discoverSchemas("UserRole", options);
  const contactSchemas = await db.discoverSchemas("Contact", options);
  const historicSchemas = await db.discoverSchemas("Historic", options);

  // Create model definition files
  await mkdirp("common/models");
  await writeFile(
    "common/models/Role.json",
    JSON.stringify(roleSchemas["jakodb.Role"], null, 2)
  );
  await writeFile(
    "common/models/TypePayment.json",
    JSON.stringify(typepaymentSchemas["jakodb.TypePayment"], null, 2)
  );
  await writeFile(
    "common/models/Language.json",
    JSON.stringify(languageSchemas["jakodb.Language"], null, 2)
  );
  await writeFile(
    "common/models/UserLanguage.json",
    JSON.stringify(userlanguageSchemas["jakodb.UserLanguage"], null, 2)
  );
  await writeFile(
    "common/models/PaymentMethod.json",
    JSON.stringify(paymentmethodSchemas["jakodb.PaymentMethod"], null, 2)
  );
  await writeFile(
    "common/models/User.json",
    JSON.stringify(userSchemas["jakodb.User"], null, 2)
  );
  await writeFile(
    "common/models/UserRole.json",
    JSON.stringify(userSchemas["jakodb.UserRole"], null, 2)
  );
  await writeFile(
    "common/models/Contact.json",
    JSON.stringify(userSchemas["jakodb.Contact"], null, 2)
  );
  await writeFile(
    "common/models/Historic.json",
    JSON.stringify(historicSchemas["jakodb.Historic"], null, 2)
  );
  // Expose models via REST API
  const configJson = await readFile("server/model-config.json", "utf-8");
  console.log("MODEL CONFIG", configJson);
  const config = JSON.parse(configJson);

  config.Role = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.TypePayment = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.Language = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.UserLanguage = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.PaymentMethod = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.User = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.UserRole = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.Contact = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  config.Historic = {
    dataSource: DATASOURCE_NAME,
    public: true
  };
  await writeFile("server/model-config.json", JSON.stringify(config, null, 2));
}

discover().then(
  success => process.exit(),
  error => {
    console.error("UNHANDLED ERROR:\n", error);
    process.exit(1);
  }
);
