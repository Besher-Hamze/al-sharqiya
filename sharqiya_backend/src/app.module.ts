import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { ContentModule } from './modules/content/content.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { MediaModule } from './modules/media/media.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { PagesModule } from './modules/pages/pages.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { ServicesModule } from './modules/services/services.module';
import { SettingsModule } from './modules/settings/settings.module';
import { StatsModule } from './modules/stats/stats.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ??
          'mongodb://127.0.0.1:27017/sharqiya',
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 120 }],
    }),
    AuditModule,
    UsersModule,
    AuthModule,
    MediaModule,
    ServicesModule,
    ProjectsModule,
    ContentModule,
    PagesModule,
    SettingsModule,
    NavigationModule,
    FaqsModule,
    TestimonialsModule,
    GalleryModule,
    QuotesModule,
    ContactModule,
    StatsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
