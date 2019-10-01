import { HttpHeaders } from '@angular/common/http';

export function getHeaders(additional: any[] = []): HttpHeaders {

  let headers = new HttpHeaders();

  headers = headers.append('Accept', 'application/json');

  additional.forEach(a => {
    headers = headers.append(a.key, a.value);
  });

  return headers;
}
