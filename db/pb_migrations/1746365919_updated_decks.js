/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1757051097")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != '' && (public = true || userId = @request.auth.id)",
    "deleteRule": "userId = @request.auth.id",
    "listRule": "@request.auth.id != '' && (public = true || userId = @request.auth.id)",
    "updateRule": "userId = @request.auth.id",
    "viewRule": "@request.auth.id != '' && (public = true || userId = @request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1757051097")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
