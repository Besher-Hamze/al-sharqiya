import { ConflictException } from '@nestjs/common';

interface MongoServerError {
  code?: number;
  keyValue?: Record<string, unknown>;
}

/** Converts Mongo duplicate-key errors (E11000) into clean 409 responses. */
export function rethrowDuplicateKey(error: unknown, entity: string): never {
  const mongoError = error as MongoServerError;
  if (mongoError?.code === 11000) {
    const dupField = Object.keys(mongoError.keyValue ?? {})[0] ?? 'field';
    const dupValue = mongoError.keyValue?.[dupField];
    throw new ConflictException(
      `${entity} with ${dupField} '${String(dupValue)}' already exists`,
    );
  }
  throw error;
}

/** Builds a case-insensitive $or regex filter across the given dotted paths. */
export function searchFilter(
  search: string | undefined,
  paths: string[],
): Record<string, unknown> {
  if (!search?.trim()) return {};
  const regex = { $regex: search.trim(), $options: 'i' };
  return { $or: paths.map((path) => ({ [path]: regex })) };
}
