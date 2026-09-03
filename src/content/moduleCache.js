const moduleRecords = new WeakMap();

export function preloadContentModule(loader) {
  if (!loader) return Promise.resolve(undefined);

  const existingRecord = moduleRecords.get(loader);
  if (existingRecord) return existingRecord.promise;

  const record = { module: null, error: null, promise: null };
  record.promise = Promise.resolve(loader()).then(
    (module) => {
      record.module = module;
      return module;
    },
    (error) => {
      record.error = error;
      throw error;
    },
  );
  moduleRecords.set(loader, record);

  return record.promise;
}

export function getPreloadedContentModule(loader) {
  return loader ? (moduleRecords.get(loader)?.module ?? null) : null;
}

export function getContentModuleError(loader) {
  return loader ? (moduleRecords.get(loader)?.error ?? null) : null;
}
