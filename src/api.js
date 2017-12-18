const prefix = '/api'
const apiUrl = '';

export function getMain() {
    return fetch(`${apiUrl}${prefix}`).then(r => r.json())
}
export function getEntry(hash) {
    console.log('getEntry' + hash);

    return fetch(`${apiUrl}${this.prefix}/get/${hash}`)
        .then(r => r.json())
}

class Api {
    constructor(options = {}) {
        this.apiUrl = apiUrl
        this.prefix = ''
        Object.assign(this, options)
    }

    getJsonHeaders() {
        return {
            'Accept': 'application/json'
        }
    }

    postJsonHeaders() {
        return {
            'Accept': 'application/json'
            , 'Content-Type': 'application/json'
        }
    }

    _buildQueryString(data) {
        return '?' + Object.keys(data).map(d => d + '=' + encodeURIComponent(data[d]))
    }
}

export class MainApi extends Api {
    constructor(options) {
        super(options)
        this.prefix = '/api'
    }

    getMain() {
        console.log('getMAIN');

        return fetch(`${apiUrl}${this.prefix}`)
            .then(r => r.json())
    }

    getEntry(hash) {
        console.log('getEntry' + hash);

        return fetch(`${apiUrl}${this.prefix}/get/${hash}`)
            .then(r => r.json())
    }
}
