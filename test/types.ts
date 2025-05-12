import http from "http";

export interface RequestOptions extends http.RequestOptions {
  method: string;
  headers?: { [key: string]: string };
}

export interface Response<T = any> {
  statusCode?: number;
  headers: http.IncomingHttpHeaders;
  body: T;
}
