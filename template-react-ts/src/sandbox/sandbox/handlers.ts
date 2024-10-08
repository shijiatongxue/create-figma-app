import { codeHandlers } from '../code/handlers';

function createRectangles(count: number) {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < count; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }] as any;
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

const handlers = {
  ...codeHandlers,
  createRectangles,
};

export default handlers;

export type SandboxHandlers = typeof handlers;
