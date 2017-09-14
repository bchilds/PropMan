let router = require('koa-router')()

const getUserDocs = async (ctx, tenantOrLandlord, isLandlord = false, property_id) => {
	// this COULD be simplified to be one unified doc retrieval function based on user.isLandlord
	let docRows, output
	output = {}
	// get the tenant documents where user_id contains the user's active tenant record's id
	if(isLandlord) {
		const values = [tenantOrLandlord.landlord_id]
		docRows = await ctx.db.query(`SELECT * FROM documents WHERE tenant_id = $1;`, values)
		output.allLandlordDocs = docRows.rows
	} else {
		const values = [tenantOrLandlord.tenant_id]
		docRows = await ctx.db.query(`SELECT * FROM documents WHERE tenant_id = $1;`, values)
		output.tenantDocs = docRows.rows
	}

	if(tenantOrLandlord.property_id) {
		// this returns all property-wide documents that are not tied to individual tenants
		const values = [tenantOrLandlord.property_id]
		docRows = await ctx.db.query(`SELECT * FROM documents WHERE property_id = $1 AND tenant_id IS NULL;`, values)
		output.propertyDocs = docRows.rows
	}
	
	return output // returns the array of results
}
exports.getUserDocs = getUserDocs

const getPropertyDocuments = async (ctx, property_id) => {
  let documentRows, docs
  const values = [property_id]
  documentRows = await ctx.db.query(`SELECT * FROM documents WHERE property_id = $1;`, values)
  docs = documentRows.rows
  return docs
}
exports.getPropertyDocuments = getPropertyDocuments

const getTenantDocuments = async (ctx, tenant_id) => {
  let documentRows, docs
  const values = [tenant_id]
  documentRows = await ctx.db.query(`SELECT * FROM documents WHERE tenant_id = $1;`, values)
  docs = documentRows.rows
  return docs
}
exports.getTenantDocuments = getTenantDocuments

const createRawtext = async (ctx) => {
	let doc, obj
	obj = ctx.request.body
	// if there is no id, give it a null value
	obj.tenant_id = obj.tenant_id || null
	obj.landlord_id = obj.landlord_id || null
	const values = [obj.landlord_id, obj.doc_type, obj.tenant_id, obj.property_id, obj.doc_body, obj.doc_url]
	doc = await ctx.db.query(`INSERT INTO documents (landlord_id, doc_type, tenant_id, property_id, doc_body, doc_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, values)
	return doc.rows[0]
}
exports.createRawtext = createRawtext

router
  .get('/', async (ctx, next) => {
    let docRows
    docRows = await ctx.db.query(`SELECT * FROM documents;`)
    ctx.body = docRows.rows
  })
	.get('/:id', async (ctx, next) => {
		let docRows
		const values = [ctx.params.id]
		docRows = await ctx.db.query(`SELECT * FROM documents WHERE document_id = $1;`, values)
		ctx.body = docRows.rows[0]
	})
	.get('/property/:property_id', async (ctx, next) => {
    ctx.body = await getPropertyDocuments(ctx, ctx.params.property_id)
  })
	.get('/tenant/:tenant_id', async (ctx, next) => {
    ctx.body = await getTenantDocuments(ctx, ctx.params.tenant_id)
  })
	.post('/add/:type', async (ctx, next) => {
		//types are lease, image, other, rawtext
		//ctx.request.body ->  {user_id, doc_type, landlord_id, tenant_id?, property_id, doc_body?, doc_url?}
		if(ctx.params.type === 'rawtext') {
			ctx.body = await createRawtext(ctx)
		} else if(ctx.params.type === 'image') {
			ctx.body = 'Not currently supported'
		} else if(ctx.params.type === 'other') {
			ctx.body = 'Not currently supported'
		} else if(ctx.params.type === 'lease') {
			ctx.body = 'Not currently supported'
		} else {
			ctx.response.status = 406
			ctx.body = `Invalid type: must be rawtext, image, other, or lease`
		}
	})
exports.routes = router

