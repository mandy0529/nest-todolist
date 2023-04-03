import { SetMetadata } from '@nestjs/common';

//  accessToken받아오는걸 전역적으로 guard를 설정해놨는데
// 전역적으로 사용하지말아야할 컨트롤러들이있어서 isPublic이라고 guard를 통과할수 있게끔 setMetadata로 guard를 직접 커스텀 하기위한 isPublic custom decorator

export const Public = () => SetMetadata('isPublic', true);
