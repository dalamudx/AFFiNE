import { IconButton } from '@affine/component';
import { DocService } from '@affine/core/modules/doc';
import { EditorSettingService } from '@affine/core/modules/editor-setting';
import { useI18n } from '@affine/i18n';
import { EditIcon, ViewIcon } from '@blocksuite/icons/rc';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback, useEffect, useState } from 'react';

export const ReadonlyModeToggleButton = () => {
  const t = useI18n();
  const docService = useService(DocService);
  const editorSettingService = useService(EditorSettingService);

  const doc = docService.doc;
  const settings = useLiveData(editorSettingService.editorSetting.settings$);

  const [isReadonly, setIsReadonly] = useState(true);

  useEffect(() => {
    setIsReadonly(doc.blockSuiteDoc.readonly);
  }, [doc.blockSuiteDoc.readonly]);

  const handleToggle = useCallback(() => {
    if (isReadonly) {
      // Switch to edit mode
      doc.blockSuiteDoc.readonly = false;
      setIsReadonly(false);
    } else {
      // Switch to readonly mode (save)
      doc.blockSuiteDoc.readonly = true;
      setIsReadonly(true);
    }
  }, [isReadonly, doc.blockSuiteDoc]);

  // Don't show button if default readonly mode is not enabled
  if (!settings.defaultReadonlyMode) {
    return null;
  }

  const tooltipContent = isReadonly
    ? t['com.affine.readonly-mode.edit.tooltip']?.() ||
    'Click to switch to edit mode'
    : t['com.affine.readonly-mode.readonly.tooltip']?.() ||
    'Click to switch to readonly mode';

  return (
    <IconButton
      size="20"
      tooltip={tooltipContent}
      data-testid="header-readonly-mode-toggle-button"
      onClick={handleToggle}
    >
      {isReadonly ? <EditIcon /> : <ViewIcon />}
    </IconButton>
  );
};
