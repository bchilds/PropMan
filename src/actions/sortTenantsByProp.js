export const SORT_TENANTS_BY_PROPS = 'sort_tenants_by_props'

export function sortTenantsByProp(tenants) {
	var tenantsObj = {}

	tenants.forEach(obj => {
		if (tenantsObj[obj.property_id]) {
			tenantsObj[obj.property_id].push(obj)
	  } else {
	  	tenantsObj[obj.property_id] = []
	  	tenantsObj[obj.property_id].push(obj)
	  }
	})

	return {
		type: SORT_TENANTS_BY_PROPS,
		payload: tenantsObj
	}
}