import { describe, expect, test } from 'vitest';

import {
  resolveEditorReadonly,
  resolveInitialEditorReadonly,
} from '../readonly';

describe('resolveInitialEditorReadonly', () => {
  test('keeps existing documents editable when the default is disabled', () => {
    expect(
      resolveInitialEditorReadonly({
        defaultReadonlyMode: false,
        isNewDoc: false,
      })
    ).toBe(false);
  });

  test('opens existing documents readonly when the default is enabled', () => {
    expect(
      resolveInitialEditorReadonly({
        defaultReadonlyMode: true,
        isNewDoc: false,
      })
    ).toBe(true);
  });

  test('keeps newly created documents editable for their first session', () => {
    expect(
      resolveInitialEditorReadonly({
        defaultReadonlyMode: true,
        isNewDoc: true,
      })
    ).toBe(false);
  });
});

describe('resolveEditorReadonly', () => {
  test('applies a user readonly choice in both page and edgeless modes', () => {
    expect(
      resolveEditorReadonly({ forcedReadonly: false, userReadonly: true })
    ).toBe(true);
  });

  test('does not allow a user toggle to bypass a forced readonly restriction', () => {
    expect(
      resolveEditorReadonly({ forcedReadonly: true, userReadonly: false })
    ).toBe(true);
  });
});
