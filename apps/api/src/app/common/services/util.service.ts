import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  getToken(req: any) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}
