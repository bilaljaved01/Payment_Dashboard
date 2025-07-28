import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://bilaljaved1002:m2HKKpAWAxiCyKbg@cluster0.mg4o41b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    AuthModule,
    PaymentsModule,
  ],
})
export class AppModule {}
