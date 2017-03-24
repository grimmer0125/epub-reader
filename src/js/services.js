import _ from 'lodash'
import { serviceMessages } from './serviceMessages'
import { app, BrowserWindow, ipcMain } from 'electron'
import { docManager } from './server/docManager'
import EPub from './server/epubDoc'

const services = {
	[serviceMessages.docPath]: (data, reply) => {
		reply({path: docManager.queryDocPath(data)})
	},

	[serviceMessages.openFiles]: ({files, apiCallId}, reply) => {
		const fileIds = {}
			, fns = files.map((fileName, i) => {
			const index = i+1
			return () => {
				docManager.loadFile(fileName, (doc) => {
					doc && (fileIds[fileName] = { id: doc.id, title: doc.title })
					console.log({files, apiCallId, index})
					if (index >= files.length) {
						reply({fileIds, apiCallId})
					} else {
						fns[index]()
					}
				})
			}
		})

		if (fns.length) {
			fns[0]()
		} else {
			reply({fileIds, apiCallId})
		}
	},

	[serviceMessages.openBook]: ({book, apiCallId}, reply) => {
		docManager.loadFile(book.fileName, (doc) => {
			if (!doc)
				return reply({apiCallId})
			return reply({book, toc: doc.toc, apiCallId})
		})
	},

}

export function registerServices() {
	EPub.register()

	ipcMain.once('require-setupDevTools', (event, data) => {
		if (process.env.NODE_ENV !== 'production') {
			event.sender.send('reply-setupDevTools', 'setup')
		}
	})

	for (const msg in services) {
		ipcMain.on(`s-${msg}`, (event, data) => {
			console.log(`[S.RECEIVE] ${msg}`, {data})
			services[msg](data, (data) => {
				console.log(`[S.REPLY] ${msg}`, Object.keys(data))
				event.sender.send(`r-${msg}`, data)
			})
		})
	}
}
