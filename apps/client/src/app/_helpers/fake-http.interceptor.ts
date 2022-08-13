import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

const widgets = {};
widgets["79497914-9534-471b-9892-cf1105de6a75"] = {
  "metric": "total_customer",
  "filter": [

  ],
  "group": [
    "status"
  ],
  "sort-by": [
    {
      "field": "status",
      "order": "asc"
    }
  ],
  data: [
    {
      status: "active",
      value: 15
    },
    {
      status: "inactive",
      value: 25
    }
  ]
};
widgets["65f6e660-14bd-4658-a8e7-a3c348a5de27"] = {
  "metric": "total_vnf",
  "filter": [

  ],
  "group": [
    "status"
  ],
  "sort-by": [
    {
      "field": "status",
      "order": "asc"
    }
  ],
  data: [
    {
      status: "deployed",
      value: 15
    },
    {
      status: "deleted",
      value: 25
    }
  ]
};

widgets["89497914-9534-471b-9892-cf1105de6a12"] = {
  "metric": "total_topology",
  "filter": [

  ],
  "group": [
    "status"
  ],
  "sort-by": [
    {
      "field": "status",
      "order": "asc"
    }
  ],
  data: [
    {
      status: "deployed",
      value: 15
    }
  ]
};
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        /* case url.endsWith('/dashboard/1') && method === 'GET':
          return getDashboardWidgets(); */
        case url.endsWith('/widget') && method === 'POST':
          return getWidgetData(request.body);
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getWidgetData(body) {
      //if (!isLoggedIn()) return unauthorized();
      return ok(widgets[body.id]);
    }


    /*  function deleteWidget() {
      return ok();
     } */

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
    }

    /* function error(message) {
      return throwError({ error: { message } });
    } */

    /*  function unauthorized() {
       return throwError({ status: 401, error: { message: 'Unauthorised' } });
     }

     function isLoggedIn() {
       return headers.get('Authorization') === 'Bearer fake-jwt-token';
     } */

    /*  function idFromUrl() {
       const urlParts = url.split('/');
       return parseInt(urlParts[urlParts.length - 1]);
     } */
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
