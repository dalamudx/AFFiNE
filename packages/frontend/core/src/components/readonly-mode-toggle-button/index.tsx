import { IconButton } from '@affine/component';
import { useGuard } from '@affine/core/components/guard';
import { DocService } from '@affine/core/modules/doc';
import { EditorService } from '@affine/core/modules/editor';
import { EditorSettingService } from '@affine/core/modules/editor-setting';
import { useI18n } from '@affine/i18n';
import { EditIcon, ViewIcon } from '@blocksuite/icons/rc';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback } from 'react';

export const ReadonlyModeToggleButton = () => {
  const t = useI18n();
  const doc = useService(DocService).doc;
  const editor = useService(EditorService).editor;
  const editorSetting = useService(EditorSettingService).editorSetting;
  const enabled = useLiveData(editorSetting.settings$).defaultReadonlyMode;
  const isInTrash = useLiveData(doc.trash$);
  const canEdit = useGuard('Doc_Update', doc.id);
  const readonly = useLiveData(editor.readonly$);

  const toggleReadonly = useCallback(() => {
    editor.setReadonly(!readonly);
  }, [editor, readonly]);

  if (!enabled || !canEdit || isInTrash) {
    return null;
  }

  return (
    <IconButton
      size="20"
      tooltip={
        readonly
          ? t['com.affine.readonly-mode.edit.tooltip']()
          : t['com.affine.readonly-mode.readonly.tooltip']()
      }
      data-testid="header-readonly-mode-toggle-button"
      onClick={toggleReadonly}
    >
      {readonly ? <EditIcon /> : <ViewIcon />}
    </IconButton>
  );
};
