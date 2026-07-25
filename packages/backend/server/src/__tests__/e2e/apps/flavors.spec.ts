import { getCurrentUserQuery } from '@affine/graphql';

import { JobExecutor } from '../../../base/job/queue/executor';
import { DatabaseDocReader, DocReader } from '../../../core/doc';
import { TelemetryService } from '../../../core/telemetry/service';
import { createApp } from '../create-app';
import { e2e } from '../test';

type TestFlavor =
  | 'allinone'
  | 'doc'
  | 'graphql'
  | 'sync'
  | 'renderer'
  | 'front';

const createFlavorApp = async (flavor: TestFlavor) => {
  // @ts-expect-error override
  globalThis.env.FLAVOR = flavor;
  return await createApp({
    tapModule(module) {
      module.overrideProvider(JobExecutor).useValue({
        onConfigInit: async () => {},
        onConfigChanged: async () => {},
        onModuleDestroy: async () => {},
      });
    },
  });
};

function getTelemetryService(app: Awaited<ReturnType<typeof createFlavorApp>>) {
  try {
    return app.get(TelemetryService, { strict: false });
  } catch {
    return undefined;
  }
}

e2e('should initialize telemetry once in all-in-one service', async t => {
  await using app = await createFlavorApp('allinone');

  const res = await app.GET('/info').expect(200);
  t.is(res.body.flavor, 'allinone');
  t.true(getTelemetryService(app) instanceof TelemetryService);
  await app
    .POST('/api/telemetry/collect')
    .send({ schemaVersion: 1, events: [] })
    .expect(201);
});

e2e('should init doc service', async t => {
  await using app = await createFlavorApp('doc');

  const res = await app.GET('/info').expect(200);
  t.is(res.body.flavor, 'doc');
  t.is(getTelemetryService(app), undefined);
  await app.POST('/api/telemetry/collect').expect(404);

  await t.throwsAsync(app.gql({ query: getCurrentUserQuery }));
});

e2e('should init graphql service', async t => {
  await using app = await createFlavorApp('graphql');

  const res = await app.GET('/info').expect(200);

  t.is(res.body.flavor, 'graphql');
  t.true(getTelemetryService(app) instanceof TelemetryService);
  await app
    .POST('/api/telemetry/collect')
    .send({ schemaVersion: 1, events: [] })
    .expect(201);

  const user = await app.gql({ query: getCurrentUserQuery });
  t.is(user.currentUser, null);
});

e2e('should init sync service', async t => {
  await using app = await createFlavorApp('sync');

  const res = await app.GET('/info').expect(200);
  t.is(res.body.flavor, 'sync');
  t.true(getTelemetryService(app) instanceof TelemetryService);
  await app
    .POST('/api/telemetry/collect')
    .send({ schemaVersion: 1, events: [] })
    .expect(201);
});

e2e('should init renderer service', async t => {
  await using app = await createFlavorApp('renderer');

  const res = await app.GET('/info').expect(200);
  t.is(res.body.flavor, 'renderer');
  t.is(getTelemetryService(app), undefined);
  await app.POST('/api/telemetry/collect').expect(404);
});

e2e('should init front service', async t => {
  await using app = await createFlavorApp('front');

  const res = await app.GET('/info').expect(200);
  t.is(res.body.flavor, 'front');
  t.true(getTelemetryService(app) instanceof TelemetryService);
  await app
    .POST('/api/telemetry/collect')
    .send({ schemaVersion: 1, events: [] })
    .expect(201);

  const docReader = app.get(DocReader);
  t.true(docReader instanceof DatabaseDocReader);
});
