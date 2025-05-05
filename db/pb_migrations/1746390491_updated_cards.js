/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3481593366")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != '' && (deckId.public = true || deckId.userId = @request.auth.id)",
    "viewRule": "@request.auth.id != '' && (deckId.public = true || deckId.userId = @request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3481593366")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
