import { route, httpGet, httpPost, httpDelete, httpPut } from '../decorators/route';
import { Base } from './index';
import { User, Response, Validation } from '../models';
import { uiResponseService } from '../services';

@route('/authenticate')
export class Authentication implements Base {

  @httpPost('/register', {
    required: ['user'],
    validate: ['user'],
  })
  async create(user: User): Promise<Response> {
    try {
      const savedUser = await user.save();
      return uiResponseService.createValidResponse(savedUser);
    } catch (e) {
      return uiResponseService.create500Response(e);
    }
  }


  @httpPost('/login', {
    required: ['email', 'password'],
  })
  async login(email: string, password: string): Promise<Response> {
    const user = await User.invalidate({ email, password });
    if (user) {
      return uiResponseService.createValidResponse(user);
    }
    return uiResponseService.createResponse({
      code: 401,
      status: false,
      message: 'Login failed',
    });
  }
}
