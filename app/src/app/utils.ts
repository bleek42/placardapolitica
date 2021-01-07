import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export default class Utils {

    static header(headers = {}) {
        if (localStorage.authToken) {
            return {
                ...headers,
                headers: {
                    Authorization: `Bearer ` + localStorage.authToken
                }
            };
        }
        return headers;
    }

    static get(http: HttpClient, url) {
        return http.get<any[]>(environment.url + url, Utils.header());
    }

    static post(http: HttpClient, url, body) {
        return http.post<any[]>(environment.url + url, body, Utils.header());
    }

    static patch(http: HttpClient, url, body) {
        return http.patch<any[]>(environment.url + url, body, Utils.header());
    }

    static put(http: HttpClient, url, body) {
        return http.put<any[]>(environment.url + url, body, Utils.header());
    }
}
