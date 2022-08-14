import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants';
import { UtilService } from '../common/services';
import { ROLES_KEY } from './roles.decorator';
import Role from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private utilService: UtilService,
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;

        const bearerToken = this.utilService.getToken(context.switchToHttp().getRequest());
        const verifyOptions = { secret: jwtConstants.secret };
        const user = await this.jwtService.verifyAsync(bearerToken, verifyOptions);
        if (requiredRoles.some((role) => user.role == role)) return true;
        throw new HttpException('You are not authorized to access this resource.', HttpStatus.FORBIDDEN);

    }
}