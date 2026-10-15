// Runs emitter-generated builder scripts (variables parts, component
// builders, builder parts) in this file. The scripts are executed
// byte-for-byte as emitted: no model in the loop, no size ceiling.
figma.showUI(__html__, { width: 380, height: 460 });
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'run') return;
  try {
    const result = await new AsyncFunction(msg.src)();
    figma.ui.postMessage({ type: 'result', name: msg.name, ok: true, result });
  } catch (e) {
    figma.ui.postMessage({ type: 'result', name: msg.name, ok: false, error: String((e && e.message) || e) });
  }
};
