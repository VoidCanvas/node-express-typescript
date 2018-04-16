import { BaseService } from './Base';
import { Validation, Base } from '../models';
import { Response, Status } from '../models/response/index'; // 

class UIResponseService extends BaseService {
  createResponse({ code, message, error, status = false, result }: {
    status: boolean,
    code?: number,
    message?: string,
    error?: Validation,
    result?: Base,
  }): Response {
    const resStatus = new Status(status);    
    resStatus.error = error;
    resStatus.message = message;
    resStatus.code = code;
    const simpleResponse = new Response(resStatus);
    simpleResponse.result = result;
    return simpleResponse;
  }

  create404Response(validation?: Validation) {
    return this.createResponse({
      status: false,
      code: 400,
      error: validation,
    });
  }

  create400Response(validation?: Validation) {
    return this.createResponse({
      status: false,
      code: 400,
      error: validation,
    });
  }

  create500Response(validation?: Validation) {
    return this.createResponse({
      status: false,
      code: 500,
      error: validation,
    });
  }

  createValidResponse(result?: Base) {
    return this.createResponse({
      result,
      status: true,
      code: 200,
    });
  }
}

export const uiResponseService = new UIResponseService();
