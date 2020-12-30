const { TestServer } = require("../../dist/tests/server")
const configuration = require("../../intern.json")
const intern = require("intern").default

intern.configure(configuration)
intern.configure({ reporters: [ "runner" ] })

const arg = process.argv[2]
if (arg == "serveOnly") {
  intern.configure({ serveOnly: true })
}

intern.on("serverStart", server => {
  server._app.use(/\/__turbo/, TestServer)

  const { stack } = server._app._router
  const staticLayerIndex = stack.findIndex(layer => layer.name == "serveStatic")
  const testLayer = stack.pop()
  stack.splice(staticLayerIndex - 1, 0, testLayer)
})

intern.run().catch(error => {
  console.error(error.toString())
  process.exit(1)
})
