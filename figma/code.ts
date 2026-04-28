// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
const newFill: SolidPaint = {
  type: 'SOLID',
  color: { r: 0.8, g: 0.8, b: 0.8 }, // RGB values range from 0 to 1
  opacity: 1,
  visible: true,
};

const frameSize = 32;
const framePadding = 4;
const frameTotalSize = frameSize + framePadding * 2;
const gridGap = 12;

const createFrame = (frameName: string) => {
  const frame = figma.createFrame();
  frame.name = frameName;
  frame.resize(frameTotalSize, frameTotalSize);
  frame.layoutMode = 'HORIZONTAL';
  frame.counterAxisAlignItems = 'CENTER';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.paddingTop = framePadding;
  frame.paddingRight = framePadding;
  frame.paddingBottom = framePadding;
  frame.paddingLeft = framePadding;
  frame.fills = [newFill];

  return frame;
};

const maxColumns = 2;

const setStrokeWeight = (node: SceneNode) => {
  if ('strokeWeight' in node) {
    node.strokeWeight = 1;
  }

  if ('children' in node) {
    node.children.forEach(setStrokeWeight);
  }
};

figma.ui.onmessage = (msg: {
  type: string;
  svgs: { content: string; name: string }[];
}) => {
  /*
  const showIconPropertyName = componentNode.addComponentProperty('ShowIcon', 'BOOLEAN', true);
  const iconLayer = componentNode.findOne(node => node.name === 'IconLayer');
  if (iconLayer) {
      // Map the layer's 'visible' property to the new boolean property name
      iconLayer.componentPropertyReferences = {
          'visible': showIconPropertyName
      };
  }
      // addComponentProperty('Mode', 'VARIANT', 'web/mobile')
*/

  if (msg.type === 'import') {
    msg.svgs.forEach((svg, index) => {
      const row = Math.floor(index / maxColumns);
      const column = index % maxColumns;
      const x = (frameTotalSize + gridGap) * column;
      const y = (frameTotalSize + gridGap) * row;
      const frame = createFrame(svg.name);
      frame.x = x;
      frame.y = y;

      const newNode = figma.createNodeFromSvg(svg.content);
      newNode.resize(frameSize, frameSize);
      newNode.name = 'Icon';
      setStrokeWeight(newNode);
      frame.appendChild(newNode);

      const component = figma.createComponentFromNode(frame);
      component.name = svg.name;
    });
  }
  // figma.currentPage.selection = nodes;
  // figma.viewport.scrollAndZoomIntoView(nodes);

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
