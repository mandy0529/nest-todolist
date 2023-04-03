import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//  req.user처럼 나의 req.user값들을 저장해주는 getCurrentUser custom decorators => logout이나 이런거할떄 나의 userId가 필요함. 그래서 셋팅해야함

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    //  data가 존재한다면 해당 key값으로 value를 return하게하고,
    //  만약 data가 존재하지않는다면 그대로의 user 전체값을 리턴하게하자
    return data ? request.user[data] : request.user;
  },
);
