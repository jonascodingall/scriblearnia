/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3064516783")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool2916563067",
    "name": "isCorrect",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3064516783")

  // remove field
  collection.fields.removeById("bool2916563067")

  return app.save(collection)
})
