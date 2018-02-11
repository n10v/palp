// @flow

async function importBlueprint(): Promise<any> {
  return import('@blueprintjs/core');
}

var toaster;

async function initToaster() {
  const blueprint = await importBlueprint();
  toaster = blueprint.Toaster.create({
    canEscapeKeyClear: false,
    position: blueprint.Position.TOP_RIGHT,
  });
}

function openToast(message: string, success: boolean) {
  (async function() {
    if (toaster == null) {
      await initToaster();
    }

    const iconName = success ? 'tick' : 'warning-sign';
    var intent;
    const blueprint = await importBlueprint();
    intent = success ? blueprint.Intent.SUCCESS : blueprint.Intent.DANGER;
    toaster.show({ iconName, intent, timeout: 3000, message });
  })();
}

function clearToaster() {
  if (toaster != null) {
    toaster.clear();
  }
}

export {
  clearToaster,
  openToast,
};
