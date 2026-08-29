/**
 * Idempotent database seeder.
 *
 * Usage:  npm run seed          upsert everything (safe to re-run)
 *         npm run seed -- --reset   drop content collections first
 *
 * Content lives in `content.ts`; the media library manifest is produced by
 * `tools/build_assets.py` and written to `media-library.json`.
 */

import * as bcrypt from 'bcryptjs';
import { config as loadEnv } from 'dotenv';
import mongoose, { Model, Schema } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';

import { AuditLogSchema } from '../modules/audit/schemas/audit-log.schema';
import {
  ContactMessageSchema,
} from '../modules/contact/schemas/contact-message.schema';
import { ContentSchema } from '../modules/content/schemas/content.schema';
import { AlbumSchema } from '../modules/gallery/schemas/album.schema';
import { FaqSchema } from '../modules/faqs/schemas/faq.schema';
import { MediaSchema } from '../modules/media/schemas/media.schema';
import { NavigationSchema } from '../modules/navigation/schemas/navigation.schema';
import { PageSchema } from '../modules/pages/schemas/page.schema';
import { ProjectSchema } from '../modules/projects/schemas/project.schema';
import {
  QuoteRequestSchema,
} from '../modules/quotes/schemas/quote-request.schema';
import { ServiceSchema } from '../modules/services/schemas/service.schema';
import { SettingsSchema } from '../modules/settings/schemas/settings.schema';
import {
  TestimonialSchema,
} from '../modules/testimonials/schemas/testimonial.schema';
import { UserSchema } from '../modules/users/schemas/user.schema';

import {
  about,
  albums,
  faqs,
  homepage,
  navigation,
  pages,
  projects,
  services,
  settings,
} from './content';

loadEnv();

interface MediaRecord {
  key: string;
  filename: string;
  url: string;
  thumbUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  alt: { en: string; ar: string };
  folder: string;
  tag: string;
}

const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/sharqiya';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@alsharqiya.ae';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Sharqiya#2026';
const ADMIN_NAME = process.env.ADMIN_NAME ?? 'Al-Sharqiya Admin';
const BCRYPT_COST = 12;

const RESET = process.argv.includes('--reset');

/** Registers a model against a raw schema without booting the Nest container. */
function model<T = unknown>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] ??
    mongoose.model(name, schema)) as unknown as Model<T>;
}

async function main(): Promise<void> {
  console.log(`Connecting to ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);

  const User = model('User', UserSchema);
  const Media = model('Media', MediaSchema);
  const Service = model('Service', ServiceSchema);
  const Project = model('Project', ProjectSchema);
  const Album = model('Album', AlbumSchema);
  const Faq = model('Faq', FaqSchema);
  const Page = model('Page', PageSchema);
  const Content = model('Content', ContentSchema);
  const Settings = model('Settings', SettingsSchema);
  const Navigation = model('Navigation', NavigationSchema);
  const Testimonial = model('Testimonial', TestimonialSchema);
  const QuoteRequest = model('QuoteRequest', QuoteRequestSchema);
  const ContactMessage = model('ContactMessage', ContactMessageSchema);
  const AuditLog = model('AuditLog', AuditLogSchema);
  void QuoteRequest;
  void ContactMessage;
  void AuditLog;

  if (RESET) {
    console.log('--reset: clearing content collections');
    await Promise.all([
      Media.deleteMany({}),
      Service.deleteMany({}),
      Project.deleteMany({}),
      Album.deleteMany({}),
      Faq.deleteMany({}),
      Page.deleteMany({}),
      Content.deleteMany({}),
      Settings.deleteMany({}),
      Navigation.deleteMany({}),
    ]);
  }

  // --- Superadmin -----------------------------------------------------------
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    console.log(`Admin already present: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      email: ADMIN_EMAIL.toLowerCase(),
      name: ADMIN_NAME,
      role: 'superadmin',
      isActive: true,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_COST),
    });
    console.log(`Created superadmin ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // --- Media library ------------------------------------------------------
  const manifestPath = join(__dirname, 'media-library.json');
  const library: MediaRecord[] = JSON.parse(
    readFileSync(manifestPath, 'utf8'),
  ) as MediaRecord[];

  for (const item of library) {
    await Media.updateOne(
      { url: item.url },
      {
        $set: {
          filename: item.filename,
          url: item.url,
          thumbUrl: item.thumbUrl,
          mimeType: item.mimeType,
          size: item.size,
          width: item.width,
          height: item.height,
          alt: item.alt,
          folder: item.folder,
        },
      },
      { upsert: true },
    );
  }
  console.log(`Media library: ${library.length} records`);

  // --- Services -----------------------------------------------------------
  for (const service of services) {
    await Service.updateOne(
      { slug: service.slug },
      { $set: { ...service, isPublished: true } },
      { upsert: true },
    );
  }
  console.log(`Services: ${services.length}`);

  // --- Projects -----------------------------------------------------------
  for (const project of projects) {
    await Project.updateOne(
      { slug: project.slug },
      { $set: { ...project, isPublished: true } },
      { upsert: true },
    );
  }
  console.log(`Projects: ${projects.length}`);

  // --- Gallery ------------------------------------------------------------
  for (const album of albums) {
    await Album.updateOne(
      { slug: album.slug },
      { $set: { ...album, isPublished: true } },
      { upsert: true },
    );
  }
  console.log(`Albums: ${albums.length}`);

  // --- FAQs ---------------------------------------------------------------
  for (const faq of faqs) {
    await Faq.updateOne(
      { 'question.en': faq.question.en },
      { $set: { ...faq, isPublished: true } },
      { upsert: true },
    );
  }
  console.log(`FAQs: ${faqs.length}`);

  // --- Static pages -------------------------------------------------------
  for (const page of pages) {
    await Page.updateOne(
      { slug: page.slug },
      { $set: { ...page, isPublished: true } },
      { upsert: true },
    );
  }
  console.log(`Pages: ${pages.length}`);

  // --- Composed page content ---------------------------------------------
  await Content.updateOne(
    { key: 'homepage' },
    { $set: { key: 'homepage', data: homepage } },
    { upsert: true },
  );
  await Content.updateOne(
    { key: 'about' },
    { $set: { key: 'about', data: about } },
    { upsert: true },
  );
  console.log('Content: homepage, about');

  // --- Settings & navigation (singletons) --------------------------------
  const settingsDoc = await Settings.findOne().select('_id');
  if (settingsDoc) {
    await Settings.updateOne({ _id: settingsDoc._id }, { $set: settings });
  } else {
    await Settings.create(settings);
  }
  console.log('Settings: updated');

  const navDoc = await Navigation.findOne().select('_id');
  if (navDoc) {
    await Navigation.updateOne({ _id: navDoc._id }, { $set: navigation });
  } else {
    await Navigation.create(navigation);
  }
  console.log('Navigation: updated');

  // Testimonials are intentionally left empty — the client should add real
  // client quotes through the dashboard rather than ship invented ones.
  const testimonialCount = await Testimonial.countDocuments();
  console.log(
    `Testimonials: ${testimonialCount} (add real ones via the dashboard)`,
  );

  await mongoose.disconnect();
  console.log('\nSeed complete.');
}

main().catch((error: Error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
