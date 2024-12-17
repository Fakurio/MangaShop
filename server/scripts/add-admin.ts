import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { HashService } from '../src/auth/services/hash.service';
import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Role, RoleEnum } from '../src/entities/role.entity';

const USERNAME = 'Admin';
const EMAIL = 'admin1@wp.pl';
const PASSWORD = '123456';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const hashService = app.get(HashService);
  const userRepository = dataSource.getRepository(User);
  const rolesRepository = dataSource.getRepository(Role);

  const hashedPassword = await hashService.hashPassword(PASSWORD);
  const existingAdmin = await userRepository.findOneBy({ email: EMAIL });
  if (!existingAdmin) {
    const adminUser = userRepository.create({
      name: USERNAME,
      email: EMAIL,
      password: hashedPassword,
      roles: await rolesRepository.find({
        where: { name: RoleEnum.ADMIN },
      }),
    });
    await userRepository.save(adminUser);
    console.log('Admin user created successfully!');
  } else {
    console.log('Admin user already exists.');
  }

  await app.close();
}

bootstrap();
