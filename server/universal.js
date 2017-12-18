const path = require('path')
const fs = require('fs')

const DocumentMeta = require('react-document-meta')

const api = require('./api')
const {render, renderHead} = require('../babel-src/serverRender')

module.exports = function universalLoader(req, res) {
    const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('read err', err)
            return res.status(404).end()
        }

        serverRender(req, res, htmlData)
            .catch(err => {
                console.error('Render Error', err)
                return res.status(500).json({message: 'Render Error'})
            })
    })
}

// this does most of the heavy lifting
async function serverRender(req, res, htmlData) {
    const context = {data: {}, head: [], req, api}
    // first
    render(req, context)

    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url)
    }

    // handle our data fetching
    const keys = Object.keys(context.data)
    const promises = keys.map(k => context.data[k])
    const resolved = await Promise.all(promises)
    resolved.forEach((r, i) => context.data[keys[i]] = r)

    //second
    const markup = render(req, context)
    const headMarkup = renderHead(context);

    const metaSeo = DocumentMeta.renderAsHTML();

    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url)
    } else {
        // we're good, add in markup, send the response
        const RenderedApp = htmlData.replace('{{SSR}}', markup)
            .replace('<meta-head></meta-head>', headMarkup)
            .replace('<meta-seo></meta-seo>', metaSeo)
            .replace('{{data}}', new Buffer(JSON.stringify(context.data)).toString('base64'))
        if (context.code)
            res.status(context.code)
        res.send(RenderedApp)
    }
}
