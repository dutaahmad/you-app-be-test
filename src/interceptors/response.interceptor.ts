/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { map } from "rxjs/operators";

// response.interface.ts
export interface ResponseSchema<T> {
  method: string;
  requestId: string;
  data: T;
  error?: any; // Optional error field
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseSchema<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseSchema<T>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const requestId = uuidv4();

    return next.handle().pipe(
      map((data) => ({
        method,
        requestId,
        data
      }))
    );
  }
}
