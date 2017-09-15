import axios from 'axios';

export const FETCH_RENT = 'fetch_rent_total_due';
export const FETCH_MESSAGES = 'fetch_messages_for_tenant_user';
export const FETCH_DOCS = 'fetch_docs_for_tenant_user';
export const FETCH_SELECTED_MEDIA = 'fetch_selected_media';
export const SHOW_DONUT = 'show_donut'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://www.myrentopia.com': 'http://localhost:8000'

export function getRentDue(userId) {
	// get current rent due by retrieving the tenant. Tenant 
	// has rent due property on it.
	const request = axios.get(`${ROOT_URL}/api/tenant/${userId}`) 
	// axios is a async helper that was imported
	return {
		type: FETCH_RENT,
		payload: request // redux-promise middleware will resolve this 
		// request for us because the redux-promise recognizes that it 
		// is a promise so it does it automatically
	}
}

export function getMessages(userId) {
	const request = axios.get(`${ROOT_URL}/api/messages/${userId}`)

	return {
		type: FETCH_MESSAGES,
		payload: request 
	}
}

export function getDocs(userId) {
	const request = axios.get(`${ROOT_URL}/api/docs/${userId}`)

	return {
		type: FETCH_DOCS,
		payload: request
	}
}

export function selectedMedia(title = '', media) {
	return {
		type: FETCH_SELECTED_MEDIA,
		payload: {
			title: title,
			media: media
		}
	}
}

export function showDonut() {
	return {
		type: SHOW_DONUT,
		payload: true
	}
}
