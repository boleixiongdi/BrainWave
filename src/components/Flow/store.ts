import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from 'reactflow';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

import { workflow } from 'components/Flow/Workflow'

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
};

// 数据结构
const defaultNode = {
  text: '',
  url: '',
  api: {
    url: '',
    protocol: 'https://',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: "{}",
      mode: 'cors',
      cache: 'default',
      responseType: 'text'
    },
    isApi: false
  },
  queryObj: {
    query: '', url: '', protocol: 'https://', isQuery: false
  },
  temperature: 0.6,
  model: 'ChatGPT',
  input: 'default',
  output: 'default',
  type: 'prompt',
  // 以下是选项
  opts: {
    ...workflow
  }
}

/**
 * 默认的节点
 */
const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'brainwave',
      data: {
        ...defaultNode
      },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    console.log('onNodesChange', changes)
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    console.log('onEdgesChange')
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    console.log('addChildNode', parentNode)

    // 可根据 parentNode 判断下一个节点类型

    const newNode = {
      id: nanoid(),
      type: 'brainwave',
      data: { ...defaultNode },
      position,
      parentNode: parentNode.id,
    };
    console.log('addChildNode', parentNode)
    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
}));

export default useStore;
