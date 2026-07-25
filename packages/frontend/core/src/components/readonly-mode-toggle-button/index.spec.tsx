/**
 * @vitest-environment happy-dom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { describe, expect, test, vi } from 'vitest';

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { tooltip?: string }
>;

const { editor, editorSetting, doc, services } = vi.hoisted(() => {
  const editor = {
    ['readonly$']: { value: true },
    setReadonly: vi.fn(),
  };
  const editorSetting = {
    ['settings$']: { value: { defaultReadonlyMode: true } },
  };
  const doc = { id: 'doc-id', ['trash$']: { value: false } };
  return {
    editor,
    editorSetting,
    doc,
    services: new Map(),
  };
});

vi.mock('@affine/component', () => ({
  IconButton: ({
    children,
    onClick,
    tooltip: _,
    ...props
  }: IconButtonProps) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@affine/core/components/guard', () => ({
  useGuard: () => true,
}));

vi.mock('@affine/core/modules/doc', () => ({
  DocService: Symbol('DocService'),
}));

vi.mock('@affine/core/modules/editor', () => ({
  EditorService: Symbol('EditorService'),
}));

vi.mock('@affine/core/modules/editor-setting', () => ({
  EditorSettingService: Symbol('EditorSettingService'),
}));

vi.mock('@affine/i18n', () => ({
  useI18n: () =>
    new Proxy(
      {},
      {
        get: () => () => 'Toggle readonly mode',
      }
    ),
}));

vi.mock('@blocksuite/icons/rc', () => ({
  EditIcon: () => <span />,
  ViewIcon: () => <span />,
}));

vi.mock('@toeverything/infra', () => ({
  useLiveData: (liveData: { value: unknown }) => liveData.value,
  useService: (service: symbol) => services.get(service),
}));

import { DocService } from '@affine/core/modules/doc';
import { EditorService } from '@affine/core/modules/editor';
import { EditorSettingService } from '@affine/core/modules/editor-setting';

import { ReadonlyModeToggleButton } from './index';

describe('ReadonlyModeToggleButton', () => {
  test('updates the editor state without writing Blocksuite readonly state', () => {
    editor['readonly$'].value = true;
    editor.setReadonly.mockReset();
    editorSetting['settings$'].value.defaultReadonlyMode = true;
    doc['trash$'].value = false;
    services.set(EditorService, { editor });
    services.set(EditorSettingService, { editorSetting });
    services.set(DocService, { doc });

    render(<ReadonlyModeToggleButton />);

    fireEvent.click(screen.getByTestId('header-readonly-mode-toggle-button'));

    expect(editor.setReadonly).toHaveBeenCalledWith(false);
  });
});
