export const resolveInitialEditorReadonly = ({
  defaultReadonlyMode,
  isNewDoc,
}: {
  defaultReadonlyMode: boolean;
  isNewDoc: boolean;
}) => {
  return defaultReadonlyMode && !isNewDoc;
};

export const resolveEditorReadonly = ({
  forcedReadonly,
  userReadonly,
}: {
  forcedReadonly: boolean;
  userReadonly: boolean;
}) => {
  return forcedReadonly || userReadonly;
};
